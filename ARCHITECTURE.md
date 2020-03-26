# Architecture

>[Original written as comment](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js#L78) by [jamiebuilds](https://github.com/jamiebuilds) in [jamiebuilds/the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler)

Today we're going to write a compiler together. But not just any compiler... A super duper teeny tiny compiler! A compiler that is so small that it is ~200 lines of actual code.

We're going to compile some `lisp`-like function calls into some `C`-like function calls.

If you are not familiar with one or the other. I'll just give you a quick intro.

If we had two functions `add` and `subtract` they would be written like this:

||LISP|C|
|---|---|---|
|`2 + 2`|`(add 2 2)`|`add(2, 2)`|
|`4 - 2`|`(subtract 4 2)`|`subtract(4, 2)`|
|`2 + (4 - 2)`|`(add 2 (subtract 4 2))`|`add(2, subtract(4, 2))`|

Easy peezy right?

Well good, because this is exactly what we are going to compile. While this
is neither a complete [`LISP`](https://en.wikipedia.org/wiki/Lisp_(programming_language)) or [`C`](https://en.wikipedia.org/wiki/C_(programming_language)) syntax, it will be enough of the syntax to demonstrate many of the major pieces of a modern compiler.

Most compilers break down into three primary stages:
1. [*Parsing*](#parsing) is taking raw code and turning it into a more abstract representation of the code.
2. [*Transformation*](#transformation) takes this abstract representation and manipulates to do whatever the compiler wants it to.
3. [*Code Generation*](#code-generation) takes the transformed representation of the code and turns it into new code.


## Parsing
Parsing typically gets broken down into two phases: Lexical Analysis and Syntactic Analysis.
1. [*Lexical Analysis*](src/tokenizer.ts) takes the raw code and splits it apart into these things called tokens by a thing called a tokenizer (or lexer).

   Tokens are an array of tiny little objects that describe an isolated piece of the syntax. They could be numbers, labels, punctuation, operators, whatever.

2. [*Syntactic Analysis*](src/parser.ts) takes the tokens and reformats them into a representation that describes each part of the syntax and their relation to one another. This is known as an intermediate representation or [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

   An Abstract Syntax Tree, or AST for short, is a deeply nested object that represents code in a way that is both easy to work with and tells us a lot of information.

For the following syntax:
```lisp
(add 2 (subtract 4 2))
```

Tokens might look something like this:
```javascript
[
  { type: TokenType.PAREN,  value: '('        },
  { type: TokenType.NAME,   value: 'add'      },
  { type: TokenType.NUMBER, value: '2'        },
  { type: TokenType.PAREN,  value: '('        },
  { type: TokenType.NAME,   value: 'subtract' },
  { type: TokenType.NUMBER, value: '4'        },
  { type: TokenType.NUMBER, value: '2'        },
  { type: TokenType.PAREN,  value: ')'        },
  { type: TokenType.PAREN,  value: ')'        },
]
```

And an Abstract Syntax Tree (AST) might look like this:
```javascript
{
  type: ASTNodeType.PROGRAM,
  body: [{
    type: ASTNodeType.CALL_EXPRESSION,
    name: 'add',
    params: [{
      type: ASTNodeType.NUMBER_LITERAL,
      value: '2',
    }, {
      type: ASTNodeType.CALL_EXPRESSION,
      name: 'subtract',
      params: [{
        type: ASTNodeType.NUMBER_LITERAL,
        value: '4',
      }, {
        type: ASTNodeType.NUMBER_LITERAL,
        value: '2',
      }]
    }]
  }]
}
```

## Transformation
The next type of stage for a compiler is transformation. Again, this just takes the AST from the last step and makes changes to it. It can manipulate the AST in the same language or it can translate it into an entirely new language.

Let’s look at how we would transform an AST.

You might notice that our AST has elements within it that look very similar. There are these objects with a type property. Each of these are known as an AST Node. These nodes have defined properties on them that describe one isolated part of the tree.

We can have a node for a `ASTNodeType.NUMBER_LITERAL`:

```javascript
{
  type: ASTNodeType.NUMBER_LITERAL,
  value: '2',
}
```

Or maybe a node for a `ASTNodeType.CALL_EXPRESSION`:
```javascript
{
  type: ASTNodeType.CALL_EXPRESSION,
  name: 'subtract',
  params: [...nested nodes go here...],
}
```

When transforming the AST we can manipulate nodes by adding/removing/replacing properties, we can add new nodes, remove nodes, or we could leave the existing AST alone and create an entirely new one based on it.

Since we’re targeting a new language, we’re going to focus on creating an entirely new AST that is specific to the target language.

### Traversal
In order to navigate through all of these nodes, we need to be able to traverse through them. This traversal process goes to each node in the AST depth-first.

```javascript
{
  type: ASTNodeType.PROGRAM,
  body: [{
    type: ASTNodeType.CALL_EXPRESSION,
    name: 'add',
    params: [{
      type: ASTNodeType.NUMBER_LITERAL,
      value: '2'
    }, {
      type: ASTNodeType.CALL_EXPRESSION,
      name: 'subtract',
      params: [{
        type: ASTNodeType.NUMBER_LITERAL,
        value: '4'
      }, {
        type: ASTNodeType.NUMBER_LITERAL,
        value: '2'
      }]
    }]
  }]
}
```

So for the above AST we would go:
1. `ASTNodeType.PROGRAM` - Starting at the top level of the AST
2. `ASTNodeType.CALL_EXPRESSION` (`add`) - Moving to the first element of the `ASTNodeType.PROGRAM`'s body
3. `ASTNodeType.NUMBER_LITERAL` (`2`) - Moving to the first element of `ASTNodeType.CALL_EXPRESSION`'s params
4. `ASTNodeType.CALL_EXPRESSION` (`subtract`) - Moving to the second element of `ASTNodeType.CALL_EXPRESSION`'s params
5. `ASTNodeType.NUMBER_LITERAL` (`4`) - Moving to the first element of `ASTNodeType.CALL_EXPRESSION`'s params
6. `ASTNodeType.NUMBER_LITERAL` (`2`) - Moving to the second element of `ASTNodeType.CALL_EXPRESSION`'s params

If we were manipulating this AST directly, instead of creating a separate AST, we would likely introduce all sorts of abstractions here. But just visiting each node in the tree is enough for what we're trying to do.

The reason I use the word "visiting" is because there is this pattern of how to represent operations on elements of an object structure.

### Visitors
The basic idea here is that we are going to create a `visitor` object that has methods that will accept different node types.

```javascript
var visitor = {
  [ASTNodeType.NUMBER_LITERAL]() {},
  [ASTNodeType.CALL_EXPRESSION]() {},
};
```

When we traverse our AST, we will call the methods on this visitor whenever we `enter` a node of a matching type.

In order to make this useful we will also pass the node and a reference to the parent node.
```javascript
var visitor = {
  [ASTNodeType.NUMBER_LITERAL](node: ASTNode, parent: ASTNode) {},
  [ASTNodeType.CALL_EXPRESSION](node: ASTNode, parent: ASTNode) {},
};
```

However, there also exists the possibility of calling things on `exit`. Imagine our tree structure from before in list form:
```yaml
- ASTNodeType.PROGRAM
  - ASTNodeType.CALL_EXPRESSION
  - ASTNodeType.NUMBER_LITERAL
  - ASTNodeType.CALL_EXPRESSION
    - ASTNodeType.NUMBER_LITERAL
    - ASTNodeType.NUMBER_LITERAL
```

As we traverse down, we're going to reach branches with dead ends. As we finish each branch of the tree we `exit` it. So going down the tree we `enter` each node, and going back up we `exit`.

```
-> ASTNodeType.PROGRAM (enter)
  -> ASTNodeType.CALL_EXPRESSION (enter)
    -> ASTNodeType.NUMBER_LITERAL (enter)
    <- ASTNodeType.NUMBER_LITERAL (exit)
    -> ASTNodeType.Call Expression (enter)
      -> ASTNodeType.NUMBER_LITERAL (enter)
      <- ASTNodeType.NUMBER_LITERAL (exit)
      -> ASTNodeType.NUMBER_LITERAL (enter)
      <- ASTNodeType.NUMBER_LITERAL (exit)
    <- ASTNodeType.CALL_EXPRESSION (exit)
  <- ASTNodeType.CALL_EXPRESSION (exit)
<- ASTNodeType.PROGRAM (exit)
```

In order to support that, the final form of our visitor will look like this:

```javascript
var visitor = {
  [ASTNodeType.NUMBER_LITERAL]: {
    enter(node: ASTNode, parent: ASTNode) {},
    exit(node: ASTNode, parent: ASTNode) {},
  }
};
```

## Code Generation
The final phase of a compiler is code generation. Sometimes compilers will do things that overlap with transformation, but for the most part code generation just means take our AST and string-ify code back out.

Code generators work several different ways, some compilers will reuse the tokens from earlier, others will have created a separate representation of the code so that they can print nodes linearly, but from what I can tell most will use the same AST we just created, which is what we’re going to focus on.

Effectively our code generator will know how to “print” all of the different node types of the AST, and it will recursively call itself to print nested nodes until everything is printed into one long string of code.

## Postscript

And that's it! That's all the different pieces of a compiler.

Now that isn’t to say every compiler looks exactly like I described here Compilers serve many different purposes, and they might need more steps than I have detailed.

But now you should have a general high-level idea of what most compilers look  like.
