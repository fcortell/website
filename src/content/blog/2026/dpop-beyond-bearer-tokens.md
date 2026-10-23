---
title: "Beyond Bearer Tokens: DPoP in Practice, with C#"
description: "Bearer tokens are a password in a coat: whoever holds them, wins. DPoP (RFC 9449) binds tokens to a key the client must prove it owns. Pros, cons, a reference scheme, and how to implement it in .NET."
pubDatetime: '2026-10-22'
author: 'Fermín Cortell'
featured: false
tags: ['security', 'oauth', 'dpop', 'authentication', 'dotnet', 'csharp']
---

# Beyond Bearer Tokens: DPoP in Practice, with C#
*Demonstrating Proof of Possession, pros and cons, and a working C# path*

---

A bearer token is a password wearing a coat. The RFC says it out loud: *any party in possession of the token can use it*. There is no "who is asking", only "what did you show me". That simplicity is why OAuth won, and it is also why stolen tokens are one of the most profitable attack classes in the industry — from leaked CI logs to XSS in a single-page app to a compromised proxy sitting between you and your API.

The usual answer to "my tokens leak" is "store them better". DPoP answers something different: **make a stolen token useless**.

## What DPoP actually does

DPoP (*Demonstrating Proof of Possession*, [RFC 9449](https://www.rfc-editor.org/rfc/rfc9449), September 2023) is an application-layer mechanism to sender-constrain OAuth 2.0 access and refresh tokens.

The client generates an asymmetric key pair and keeps the private key locally. Every request carries a small signed JWT — the **DPoP proof** — in a `DPoP` header. The authorization server binds the issued token to the *public* key by adding a confirmation claim (`cnf.jkt`) to the access token. The resource server then requires, on every single call, both the token **and** a fresh proof signed by the matching private key.

Steal the token and you get a string that no server will accept. Steal the token *and* the private key and you are back to square one — which is exactly why DPoP implementations should store that key in hardware where possible.

## The flow

```text
+--------+                                    +---------------------+
|        |--(A) Token request + DPoP proof -->|  Authorization      |
|        |                                    |  Server (AS)        |
| Client |<-(B) access token with cnf.jkt ----|                     |
|        |     token_type = DPoP              +---------------------+
|        |
|        |                                    +---------------------+
|        |--(C) Authorization: DPoP <at>      |  Resource Server    |
|        |     DPoP: <fresh proof JWT> ------>|  (API)              |
|        |<-(D) 200 OK ------------------------|                     |
+--------+                                    +---------------------+
```

Three things worth noticing:

1. **The proof is per-request.** Not per-session, not per-token. New `jti`, new `iat`, new signature every call.
2. **The proof is bound to the request itself** (`htm` = method, `htu` = URI) and to the token (`ath` = hash of the access token). A proof captured on `GET /orders` is worthless for `POST /payments`.
3. **DPoP is not client authentication.** It does not identify the client to the AS; it constrains who can *use* the token afterwards. It composes with `client_secret`, `private_key_jwt`, or with no client auth at all (public clients, which is where it shines).

## Anatomy of a proof

A real proof JWT from a working sample looks like this:

```json
// header
{
  "alg": "ES384",
  "typ": "dpop+jwt",
  "jwk": {
    "kty": "EC",
    "crv": "P-384",
    "x": "c_Ua8nenm8XjoXvxcFvonuNeJgYg3YBAvhY2zuBI5IYl1mOhMFHWtacGoLfzA11W",
    "y": "zXJSqLxYgyqq3jPdBeuqgcvuW9d4JwVL_fgsqwT8wvr05uihuU5FsX3DY-LtGF7E"
  }
}

// payload
{
  "jti": "xaWoIEMRqtRbrta13AVceLUVJxW1zqbl2RcQhmuG0nA",
  "htm": "GET",
  "htu": "https://api.example.com/api/values",
  "iat": 1691659934,
  "ath": "5p3pmE3nvOURS-mZoEsPZkWb49vFNp7cuFrXs1mITxM"
}
```

And the access token it accompanies carries the binding:

```json
"cnf": { "jkt": "loM5ro2mqcEyBS46Z8CN1bP_wlYn2XPaGmTXQUzQc94" }
```

`jkt` is the base64url SHA-256 **JWK thumbprint** of the public key. The API computes the same thumbprint from the `jwk` in the proof header and compares. If they differ, the token was not issued for this key: 401.

The server-side checklist (RFC 9449 §4.3) is short and unforgiving:

- `typ` must be `dpop+jwt`, and `alg` must be asymmetric — no `none`, no HS256.
- `jwk` must be present, public, and consistent with the signature.
- Verify the signature with that `jwk`.
- `jti` must be unique within the acceptance window (replay cache).
- `htm` and `htu` must match the actual request; `htu` excludes query string and fragment.
- `iat` must be inside the window (a few seconds, clock skew included).
- If an access token is present, `ath` must equal base64url(SHA-256(token)).
- If the AS requires a nonce, `nonce` must match the current server value.

## The nonce dance

When the AS or the API wants to defeat pre-computed proofs, it replies with `401` and `error="use_dpop_nonce"`, plus a `DPoP-Nonce` header. The client retakes the proof including that nonce and retries. Nonces rotate; a client that ignores rotation will loop until it gives up. This is the single most common source of "it worked in dev, it 401s in prod".

## Pros

- **Leaked tokens stop being credentials.** The threat that actually bites — logs, crash dumps, XSS exfiltration, a compromised dependency, a verbose proxy — loses most of its value.
- **No TLS client certificates.** Unlike mTLS (RFC 8705), there is no PKI to run, no certificate distribution to browsers, no reverse-proxy gymnastics. It works over plain HTTPS, from a browser, a mobile app, or a service.
- **Per-request granularity.** `htm`/`htu`/`ath` make each proof single-use and single-target, which is a much tighter replay window than "until the token expires".
- **Works for public clients.** Single-page apps and installed desktop/mobile apps are exactly the cases where TLS client auth and RFC 8471 token binding are impractical. DPoP was designed for them.
- **Composes with everything else.** PKCE, PAR, JAR, refresh token rotation, `private_key_jwt`: DPoP sits alongside, not instead.
- **Defense in depth against confused deputies.** A malicious resource server replaying a token it received against another API no longer works, without you having to get audience restriction right everywhere.

## Cons

- **It is a protocol change on three sides.** AS must issue, client must prove, API must validate. You cannot adopt it "just for one endpoint" without the identity provider playing along.
- **Every request costs a signature.** ECDSA on P-256 is cheap, but it is not free: budget roughly tens of microseconds to a few milliseconds depending on key storage. On a TPM or secure enclave, plan for milliseconds, not microseconds.
- **Replay cache and nonce state are now yours.** `jti` deduplication needs shared state across API instances (Redis or similar). Nonces need TTL, rotation, and a way to publish the new value on rejection.
- **Harder debugging.** A `401` can be bad token, wrong key, stale nonce, clock skew, `htu` mismatch (trailing slash, port, proxy rewriting `Host`), or a missing `ath`. Your error messages need to be specific or you will lose days.
- **Key management is a new surface.** Where does the client key live? If it sits in a plain file or memory, you have raised the bar only slightly. The real gain comes from non-extractable keys: WebCrypto in the browser, DPAPI/CNG or Keychain on the desktop, Keystore/Secure Enclave on mobile, TPM on servers.
- **Ecosystem support is uneven.** Microsoft Entra supports DPoP for MSAL public clients; Duende IdentityServer has first-class PoP; Keycloak had it as preview since 23 and made it officially supported in 26.4. ASP.NET Core itself still has no built-in JWT-bearer DPoP validation — you lean on library or sample code.
- **XSS in your own app context still wins.** If an attacker executes code inside your SPA, it can call your signing routine and mint proofs at will. DPoP does not save you; only not having XSS does. Same for a compromised endpoint: whoever can run code where the key lives can act.
- **Not a replacement for TLS.** Proofs are not request integrity — anything before the signature can still be tampered with in flight. HTTPS remains mandatory.

## DPoP vs the alternatives

| | Bearer | DPoP | mTLS (RFC 8705) |
|---|---|---|---|
| Stolen token usable? | Yes | No | No |
| Client certificate needed? | No | No | Yes |
| Works in browsers/SPAs? | Yes | Yes | Painful |
| Transport changes? | No | No | Yes |
| Server-side state | None | Replay cache + nonce | None extra |
| Typical fit | Simple internal APIs | Public clients, mobile, SPA | Service-to-service, high assurance |

Microsoft's own guidance draws the same line: mTLS PoP for machine-to-machine (workloads pulling secrets from a vault), DPoP for public client applications.

## A simple reference scheme

For a typical product with a SPA or mobile app and an API:

1. **Client** generates an EC key pair on first launch and stores the private key non-extractably. It publishes nothing; the public key travels inside each proof.
2. **Login**: the client sends `dpop_jkt=<thumbprint>` on the authorize request, so the authorization code itself is bound. Code interception stops being useful.
3. **Token endpoint**: the client sends a proof; the AS returns an access token with `cnf.jkt` and `token_type: DPoP`, plus a DPoP-bound refresh token.
4. **API calls**: `Authorization: DPoP <token>` and `DPoP: <proof>` with `ath`, `htm`, `htu`, `iat`, `jti`.
5. **API** validates signature, binding (`cnf.jkt` vs proof `jwk` thumbprint), `ath`, method/URI, `iat` window, `jti` uniqueness, and nonce if enforced.
6. **Refresh**: new proof at the token endpoint; keep the same key, rotate keys only deliberately, and never rotate while tokens bound to the old key are still alive.

## Doing it in C#

### Client side: let the library carry it

The pragmatic route in .NET is `Duende.AccessTokenManagement`. You supply a JWK once and it produces proofs at the token endpoint and on every outbound `HttpClient` call:

```csharp
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text.Json;

var rsaKey = new RsaSecurityKey(RSA.Create(2048));
var jwkKey = JsonWebKeyConverter.ConvertFromSecurityKey(rsaKey);
jwkKey.Alg = "PS256";
var jwk = JsonSerializer.Serialize(jwkKey);

services.AddOpenIdConnectAccessTokenManagement(options =>
{
    options.DPoPJsonWebKey = jwk;
});

services.AddUserAccessTokenHttpClient("api", configureClient: client =>
{
    client.BaseAddress = new Uri("https://api.example.com");
});
```

With `AddOpenIdConnectAccessTokenManagement`, the library also injects `dpop_jkt` into the authorize request and handles the nonce retry for you. If the key must come from a vault or a secure store, implement `IDPoPKeyStore` instead of inlining it.

Two traps documented by Duende: don't assign a new `OpenIdConnectEvents` after the library configured its handlers, and don't use `OpenIdConnectOptions.EventsType` — both silently drop the DPoP hooks. Sign-in still succeeds, just without the binding.

### Client side: building a proof by hand

Sometimes you are not behind `HttpClient` factories — a console tool, a test harness, a custom transport. The proof is a JWT with a `jwk` header and four claims:

```csharp
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

public sealed class DpopProofFactory : IDisposable
{
    private readonly ECDsa _key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
    private readonly Dictionary<string, object> _publicJwk;

    public DpopProofFactory()
    {
        var jwk = JsonWebKeyConverter.ConvertFromSecurityKey(new ECDsaSecurityKey(_key));
        jwk.Alg = "ES256";
        _publicJwk = JsonSerializer.Deserialize<Dictionary<string, object>>(
            JsonSerializer.Serialize(jwk))!;
    }

    public string CreateProof(string method, string url, string? accessToken = null, string? nonce = null)
    {
        var now = DateTimeOffset.UtcNow;
        var claims = new Dictionary<string, object>
        {
            ["jti"] = Guid.NewGuid().ToString("N"),
            ["htm"] = method.ToUpperInvariant(),
            ["htu"] = StripQueryAndFragment(url),
            ["iat"] = now.ToUnixTimeSeconds()
        };

        if (accessToken is not null)
        {
            claims["ath"] = Base64UrlEncoder.Encode(
                SHA256.HashData(Encoding.ASCII.GetBytes(accessToken)));
        }

        if (nonce is not null)
        {
            claims["nonce"] = nonce;
        }

        var descriptor = new SecurityTokenDescriptor
        {
            TokenType = "dpop+jwt",
            Claims = claims,
            IssuedAt = now.UtcDateTime,
            Expires = now.AddMinutes(1).UtcDateTime,
            SigningCredentials = new SigningCredentials(
                new ECDsaSecurityKey(_key), SecurityAlgorithms.EcdsaSha256),
            AdditionalHeaderClaims = new Dictionary<string, object> { ["jwk"] = _publicJwk }
        };

        return new JsonWebTokenHandler().CreateToken(descriptor);
    }

    private static string StripQueryAndFragment(string url)
    {
        var uri = new Uri(url);
        return uri.GetLeftPart(UriPartial.Path);
    }

    public void Dispose() => _key.Dispose();
}
```

Send it as `Authorization: DPoP <token>` plus `DPoP: <proof>`, and on a `use_dpop_nonce` response read `DPoP-Nonce`, rebuild the proof, retry once.

### API side: validating the proof

Validate the access token as usual (authority, signature, `aud`, `typ` of `at+jwt`), then add the DPoP layer. With Duende's samples the wiring is one line:

```csharp
services.AddAuthentication("dpoptokenscheme")
    .AddJwtBearer("dpoptokenscheme", options =>
    {
        options.Authority = "https://identity.example.com";
        options.MapInboundClaims = false;
        options.TokenValidationParameters.ValidTypes = new[] { "at+jwt" };
        options.TokenValidationParameters.ValidateAudience = true;
        options.TokenValidationParameters.ValidAudience = "https://api.example.com";
    });

services.ConfigureDPoPTokensForScheme("dpoptokenscheme");
```

That handler performs the checks listed earlier: proof signature, `cnf.jkt` versus proof thumbprint, `ath`, `htm`, `htu`, `iat`, `jti` replay. `Microsoft.IdentityModel.Dpop` (part of the IdentityModel 8.x family, the same stack ASP.NET Core uses under the hood for token validation) provides the proof-validation primitives if you prefer to compose the pipeline yourself.

Whatever you use, make sure these hold:

- `htu` is compared against the URL the API *thinks* it is behind. If you sit behind a proxy that rewrites scheme or host, fix `ForwardedHeaders` first, or every proof fails.
- The `jti` cache is shared across instances and keyed with the thumbprint, with a TTL slightly larger than the `iat` window.
- Clock skew tolerance is small and explicit — 30 to 60 seconds, not "whatever the default was".
- Errors distinguish `invalid_dpop_proof`, `invalid_token` and `use_dpop_nonce`. Your future self will thank you.

## When is it worth it?

Adopt DPoP when the token is the thing most likely to leak and the client is a public one: mobile apps, desktop apps, SPAs, and any API where a stolen access token currently means full impersonation. It is also a good fit when your identity provider supports it out of the box and your APIs are already JWT-based — the migration is additive, not a rewrite.

Skip it when the AS cannot issue DPoP-bound tokens (then you literally cannot), when your tokens already never leave a locked-down server-to-server channel with mTLS, or when your team cannot afford the operational cost of replay caches and nonces for a threat you have already mitigated elsewhere.

The honest summary: DPoP does not make your system secure. It makes one specific, very common failure — the stolen token — stop working. That is a narrow promise, and exactly why it is worth taking seriously.

Bearer tokens solved authentication by making it dumb. DPoP adds back the one property that dumbness cost us: the token only works for the hand that holds the key.
