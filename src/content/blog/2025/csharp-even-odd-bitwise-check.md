---
title: "Even and odd check in C# using bitwise operations"
description: "Learn how to efficiently check if numbers are even or odd using bitwise operations in C#, a more elegant alternative to the modulo operator"
pubDatetime: '2025-07-03'
author: 'Fermín Cortell'
featured: true
tags: ['csharp', 'bitwise', 'performance', 'algorithms', 'programming-tips']
---

In C#, you can check if a number is even or odd using bitwise operations. This approach is not only elegant but also potentially more efficient than traditional methods (modulo with %).

## How Bitwise Even/Odd Check Works

The key insight is that in binary representation, the least significant bit (LSB) determines whether a number is even or odd:

- If the last bit is **0** → the number is **even**
- If the last bit is **1** → the number is **odd**

## Binary Examples

Let's look at some binary representations:

```text
4 (even) = 100₂  → last bit is 0
5 (odd)  = 101₂  → last bit is 1
8 (even) = 1000₂ → last bit is 0
9 (odd)  = 1001₂ → last bit is 1
```

## Using Bitwise AND with Explicit Comparison

```csharp
public static bool IsEven(int number)
{
    return (number & 1) == 0;
}

public static bool IsOdd(int number)
{
    return (number & 1) == 1;
}
```

## Complete Example

```csharp
using System;

class Program
{
    static void Main()
    {
        int[] numbers = { 1, 2, 3, 4, 5, 10, 15, 20, 25 };
        
        Console.WriteLine("Number\tBinary\t\tEven/Odd");
        Console.WriteLine("------\t------\t\t--------");
        
        foreach (int num in numbers)
        {
            string binary = Convert.ToString(num, 2).PadLeft(8, '0');
            string evenOdd = IsEven(num) ? "Even" : "Odd";
            Console.WriteLine($"{num}\t{binary}\t{evenOdd}");
        }
    }
    
    public static bool IsEven(int number)
    {
        return (number & 1) == 0;
    }
    
    public static bool IsOdd(int number)
    {
        return (number & 1) != 0;
    }
}
```

## How the Bitwise AND Operation Works

The bitwise AND operation (`&`) compares each bit of the operands:

```text
Example with number 5:
5 in binary:  101
1 in binary:  001
5 & 1 result: 001 (which is 1)

Example with number 4:
4 in binary:  100
1 in binary:  001
4 & 1 result: 000 (which is 0)
```

The operation `number & 1` effectively masks all bits except the least significant bit, giving us either 0 or 1.

## Performance Comparison

While modern compilers optimize both approaches similarly, bitwise operations are conceptually faster:

```csharp
// Traditional modulo approach
public static bool IsEvenModulo(int number)
{
    return number % 2 == 0;
}

// Bitwise approach
public static bool IsEvenBitwise(int number)
{
    return (number & 1) == 0;
}
```

## Working with Negative Numbers

The bitwise approach works correctly with negative numbers too:

```csharp
Console.WriteLine(IsEven(-4));  // True
Console.WriteLine(IsEven(-3));  // False
```

This is because negative numbers in two's complement representation maintain the same least significant bit pattern for even/odd determination.

## Key Takeaways

1. **Bitwise AND with 1** (`number & 1`) isolates the least significant bit
2. **LSB = 0** means the number is even
3. **LSB = 1** means the number is odd
4. This method works for both positive and negative integers
5. It's a clean, efficient way to check even/odd without division or modulo operations

The bitwise approach demonstrates a fundamental understanding of how numbers are represented in binary and showcases the power of bitwise operations in C#.