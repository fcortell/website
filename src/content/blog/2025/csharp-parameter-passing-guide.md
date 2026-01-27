---
title: "Parameter passing in C#"
description: "A comprehensive guide to understanding parameter passing in C#, including value types, reference types, and the different parameter modifiers (ref, out, params)"
pubDatetime: '2025-02-17'
author: 'Fermín Cortell'
featured: true
tags: ['csharp', 'programming', 'parameters', 'reference-types', 'value-types', 'tutorial']
---

Source: [jonskeet.uk](https://jonskeet.uk/csharp/parameters.html)

Microsoft also has a [good page](http://msdn.microsoft.com/en-us/library/8f1hz171.aspx) about this topic (which I believe uses exactly the same terminology as this page - let me know if they appear to disagree).

Note: Lee Richardson has written a [complementary article](https://rapidapplicationdevelopment.blogspot.com/2007/01/parameter-passing-in-c.html) to this one, particularly for those who learn well with pictures. Basically it illustrates the same points, but using pretty diagrams to show what's going on.

## Table of contents

- [Preamble: what is a reference type?](#preamble-what-is-a-reference-type)
- [Further preamble: what is a value type?](#further-preamble-what-is-a-value-type)
- [Checking you understand the preamble...](#checking-you-understand-the-preamble)
- [The different kinds of parameters](#the-different-kinds-of-parameters)
- [Value parameters](#value-parameters)
- [Reference parameters](#reference-parameters)
- [Output parameters](#output-parameters)
- [Parameter arrays](#parameter-arrays)
- [Mini-glossary](#mini-glossary)

## Preamble: what is a reference type?

Note: I have a [whole article about reference types and value types](references.html) which you may find useful, particularly if you're quite new to .NET. This preamble is a shorter version of the same information, but if you find anything confusing it's probably worth reading both.

In .NET (and therefore C#) there are two main sorts of type: _reference types_ and _value types_. Classes, delegates and interfaces are reference types; structs and enums are value types. They act differently, and a lot of confusion about parameter passing is really down to people not properly understanding the difference between them. Here's a quick explanation:

A _reference type_ is a type which has as its value a _reference_ to the appropriate data rather than the data itself. For instance, consider the following code:

```csharp
StringBuilder sb = new StringBuilder();
```

(I have used `StringBuilder` as a random example of a reference type - there's nothing special about it.) Here, we declare a variable `sb`, create a new `StringBuilder` object, and assign to `sb` a reference to the object. The value of `sb` is _not_ the object itself, it's the reference. Assignment involving reference types is simple - the value which is assigned is the value of the expression/variable - i.e. the reference:

```csharp
StringBuilder first = new StringBuilder();
first.Append("hello");
StringBuilder second = first;
Console.WriteLine(second); // Prints hello
```

Here we declare a variable `first`, create a new `StringBuilder` object, and assign to `first` a reference to the object. We then assign to `second` the value of `first`. This means that they both refer to the same object. If we modify the contents of the object via another call to `first.Append`, that change is visible via `second`:

```csharp
StringBuilder first = new StringBuilder();
first.Append("hello");
StringBuilder second = first;
first.Append(" world");
Console.WriteLine(second); // Prints hello world
```

They are still, however, independent variables themselves. Changing the value of `first` to refer to a completely different object (or indeed changing the value to a null reference) doesn't affect `second` at all, or the object it refers to:

```csharp
StringBuilder first = new StringBuilder();
first.Append("hello");
StringBuilder second = first;
first.Append(" world");
first = new StringBuilder("goodbye");
Console.WriteLine(first); // Prints goodbye
Console.WriteLine(second); // Still prints hello world
```

To reiterate: class types, interface types, delegate types and array types are all reference types.

## Further preamble: what is a value type?

While reference types have a layer of indirection between the variable and the real data, _value types_ don't. Variables of a value type directly contain the data. Assignment of a value type involves the actual data being copied. Take a simple struct, for example:

```csharp
public struct IntHolder
{
    public int i;
}
```

Wherever there is a variable of type `IntHolder`, the value of that variable contains all the data - in this case, the single integer value. An assignment copies the value, as demonstrated here:

```csharp
IntHolder first = new IntHolder();
first.i = 5;
IntHolder second = first;
first.i = 6;
Console.WriteLine(second.i);
```

Output: `5`

Here, `second.i` has the value 5, because that's the value `first.i` has when the assignment `second = first` occurs - the values in `second` are independent of the values in `first` apart from when the assignment takes place.

Simple types (such as `float`, `int`, `char`), enum types and struct types are all value types.

Note that many types (such as `string`) appear in some ways to be value types, but in fact are reference types. These are known as _immutable_ types. This means that once an instance has been constructed, it can't be changed. This allows a reference type to act _similarly_ to a value type in some ways - in particular, if you hold a reference to an immutable object, you can feel comfortable in returning it from a method or passing it to another method, safe in the knowledge that it won't be changed behind your back.

## Checking you understand the preamble...

What would you expect to see from the code above if the declaration of the `IntHolder` type was as a class instead of a struct? If you don't understand why the output would be `6`, please re-read both preambles - if you _do_ understand it, parameter passing becomes very easy to understand.

## The different kinds of parameters

There are four different kinds of parameters in C#: value parameters (the default), reference parameters (which use the `ref` modifier), output parameters (which use the `out` modifier), and parameter arrays (which use the `params` modifier). _You can use any of them with both value and reference types._

## Value parameters

By default, parameters are value parameters. This means that a new storage location is created for the variable in the function member declaration, and it starts off with the value that you specify in the function member invocation. If you change that value, that doesn't alter any variables involved in the invocation. For instance, if we have:

```csharp
void Foo(StringBuilder x)
{
    x = null;
}

// Usage:
StringBuilder y = new StringBuilder();
y.Append("hello");
Foo(y);
Console.WriteLine(y == null); // Output: False
```

The value of `y` isn't changed just because `x` is set to `null`. Remember though that the value of a reference type variable is the reference - if two reference type variables refer to the same object, then changes to the data in that _object_ will be seen via both variables. For example:

```csharp
void Foo(StringBuilder x)
{
    x.Append(" world");
}

// Usage:
StringBuilder y = new StringBuilder();
y.Append("hello");
Foo(y);
Console.WriteLine(y); // Output: hello world
```

Now consider what happens when value types are passed by value:

```csharp
void Foo(IntHolder x)
{
    x.i = 10;
}

// Usage:
IntHolder y = new IntHolder();
y.i = 5;
Foo(y);
Console.WriteLine(y.i); // Output: 5
```

When `Foo` is called, `x` starts off as a struct with value `i=5`. Its `i` value is then changed to 10. `Foo` knows nothing about the variable `y`, and after the method completes, the value in `y` will be exactly the same as it was before (i.e. 5).

## Reference parameters

Reference parameters don't pass the values of the variables used in the function member invocation - they use the variables themselves. Rather than creating a new storage location for the variable in the function member declaration, the same storage location is used. Reference parameters need the `ref` modifier as part of both the declaration and the invocation:

```csharp
void Foo(ref StringBuilder x)
{
    x = null;
}

// Usage:
StringBuilder y = new StringBuilder();
y.Append("hello");
Foo(ref y);
Console.WriteLine(y == null); // Output: True
```

Here, because a reference to `y` is passed rather than its value, changes to the value of parameter `x` are immediately reflected in `y`.

Now consider the struct code using reference parameters:

```csharp
void Foo(ref IntHolder x)
{
    x.i = 10;
}

// Usage:
IntHolder y = new IntHolder();
y.i = 5;
Foo(ref y);
Console.WriteLine(y.i); // Output: 10
```

The two variables are sharing a storage location, so changes to `x` are also visible through `y`.

### Sidenote: what is the difference between passing a value object by reference and a reference object by value?

This is absolutely crucial to understanding parameter passing in C#, and is why it is highly confusing to say that objects are passed by reference by default instead of the correct statement that object references are passed by value by default.

## Output parameters

Output parameters are very similar to reference parameters. The only differences are:

- The variable specified on the invocation doesn't need to have been assigned a value before it is passed to the function member
- The parameter is considered initially unassigned (you must assign it a value before you can "read" it)
- The parameter _must_ be assigned a value before the function member completes normally

```csharp
void Foo(out int x)
{
    // Can't read x here - it's considered unassigned
    
    // Assignment - this must happen before the method can complete normally
    x = 10;
    
    // The value of x can now be read:
    int a = x;
}

// Usage:
// Declare a variable but don't assign a value to it
int y;

// Pass it in as an output parameter, even though its value is unassigned
Foo(out y);

// It's now assigned a value, so we can write it out:
Console.WriteLine(y); // Output: 10
```

## Parameter arrays

Parameter arrays allow a variable number of arguments to be passed into a function member. The definition of the parameter has to include the `params` modifier:

```csharp
void ShowNumbers(params int[] numbers)
{
    foreach (int x in numbers)
    {
        Console.Write(x + " ");
    }
    Console.WriteLine();
}

// Usage:
int[] x = {1, 2, 3};
ShowNumbers(x);      // Output: 1 2 3 
ShowNumbers(4, 5);   // Output: 4 5 
```

## Mini-glossary

**Function member**: A method, property, event, indexer, user-defined operator, instance constructor, static constructor, or destructor.

**Output parameter**: A parameter very similar to a reference parameter, but with different definite assignment rules.

**Reference parameter**: A parameter which shares the storage location of the variable used in the function member invocation.

**Reference type**: Type where the value of a variable/expression of that type is a reference to an object rather than the object itself.

**Value parameter**: A value parameter that has its own storage location, and thus its own value. The initial value is the value of the expression used in the function member invocation.

**Value type**: Type where the value of a variable/expression of that type is the object data itself.

Understanding these concepts is fundamental to writing effective C# code and avoiding common pitfalls related to parameter passing and object manipulation.