# Multi-Staged Metaprogramming JavaScript

## Metaprogramming

Metaprogramming is the ability to treat the source code as first-class data and emit it to the program. In Multi-stage compile-time metaprogramming the above procedure can be repeated in infinite nesting level at compile time.

## Contributions

We extend JavaScript with the essentials of multi-staged metaprogramming and implement it in SpiderMonkey JavaScript engine. We indicate the minimal modification occurred in SpiderMonkey by minor extending the lexer, parser, AST, reflection (parse) and the addition of the unparsing procedure, some library functions, the staged logic and a debugging system.

# How-To-Use

## Semantics

* **Quasi-quotes .&lt; &gt;.** Are holding JavaScript code definitions in order to convey them to AST form.
*  **Escape .~** It prevents an expression to convert its context to AST by evaluating its current value. It is defined only inside a Quasi-quote definitions.
*  **Escape-value .@** Is used when we need to prevent the conversion of an expression to AST by matching the current evaluated value to an AST form.
*  **Inline .!** Injects the declared location with the AST of the evaluated value, eliminating itself
*  **Execute .&amp;** Defines a statement that will be executed in the staged process.

## Example

```JS
.& { //This block of code will be executed at compile time

  // Assign to variable printArgAst the source code of 2 arguments
  var printArgAst = .< 'compile time', 'metaprogramming'; >.;
  
  // Assign to variable logAst the source code of console.log, 
  // enriched with the printArgAst arguments;
  var logAst = .< console.log( .~printArgAst ); >.;
}

// pure javascript statement
console.log( 'runtime pure statement' );

// emit to final program the logAst
.!logAst;
```

# Deploy - Compile

## Import to visual studio

We deploy the project at visual studio 2010.
You can find the solution at:
```bash
js\Project\SpiderMonkey\SpiderMonkey.sln
```
You can find the html/css/js assets and examples at:
```bash
js\Project\MultiStagedExec\Src
```

## Deploy

### Multi-Staged Compiler

**Compile**

add `JS_STAGEDJS` flag to preprocessor

**Run**

```Bash
-i, --inputfile, input filepath
-o, --outputfile, output filepath

example> -i power.js -o power_final.js
```

### Multi-Staged Debugger

**Compile**

add `JS_STAGEDJS_DBG` flag to preprocessor

**Run**

```Bash
-i, --inputfile, input filepath
-o, --outputfile, output filepath
-b, --browser, browser executable location

example> -i power.js -o power_final.js -b chrome
```

### Multi-Staged Web Application

**Compile**

add `JS_STAGEDJS_SERVICE` flag to preprocessor

**Run**

```Bash
(optional) --port, web server port

Src/staged_client/js/main.js, variable SERVER_URL
```

# Creators

Thesis submitted by [Yannis Apostolidis](https://www.linkedin.com/in/giannisapostolidis) In partial fulfillment of the requirements for the Masters&rsquo; of Science degree in Computer Science.


Thesis Supervisor [Anthony Savidis](http://www.ics.forth.gr/hci/index_main.php?l=e&c=517)

The work reported in this thesis has been conducted at the Human Computer Interaction (HCI) laboratory of the Institute of Computer Science (ICS) of the Foundation for Research and Technology - Hellas (FORTH), and has been financially supported by a FORTH-ICS scholarship.
