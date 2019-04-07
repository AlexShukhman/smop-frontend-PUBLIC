var docs = `
# Documentation

_This article explains the functionality of .parth files, and how to create them._

**Why use .parth files?**

.parth files offer owners a single, simple format into which to input all the information that they need to be tested. If you can provide smop.io with a filled out .parth file, then it can return to you the best code for your problems.

**How do I create a .parth file?**

To write a .parth file, you need to write a sequence of parth statements. This sequence will be used to automatically simulate user behavior, so the order in which they are written is highly important.

**What is a parth statement?**

Parth statements are easy-to-write statements that give the smop team the information you want to be tested.

Parth statements are made up of either:

1. Assert statements
2. Action statements
3. Function statements

Assert statements will represent things that can be observed on a website by checking if some characteristic is &#39;true&#39; on a web page, while action statements represent what actions a user can do to a website. Function statements are intended for use with scripting or programming languages and will test return values of functions called in a specific way.

**How do I write a parth statement?**

The exact specification of a parth statement is given [here](https://github.com/AlexShukhman/smopapi/blob/betafrontend/test.md). However, for a more detailed tutorial, you can keep reading this document. The general form for the different kinds of  parth statements are given in their respective sections below.

**What do I need to know to write an assert statement?**

The generalized form of an assert statement is given below:

_-&gt; tag id attr [value] [tag id]_

Assert statements will begin with the characters &quot;-&gt;&quot; - simply a dash (-) and a greater-than sign (&gt;). Let&#39;s further parse this generalized form:

- _Tag_ refers to the HTML tag which we wish to act upon. This may be a button (_&lt;button&gt;_), title (_&lt;title&gt;_), paragraph (_&lt;p&gt;_), among many others. For a comprehensive list of HTML tags, view documentation for HTML [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).
- _id_ refers to the id of the tag which is being acted upon. The id of the tag must be specified.
- _attr_ refers to an HTML attribute. Attributes are characteristics of HTML tags - for example, image sources (_src_) and element ids (_id_). More information on HTML attributes can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).
- _[value]_ refers to the value which an HTML attribute will take. To continue our previous example, if we desired for an image source to be the image &#39;_abc.jpg_&#39;, we would write &#39;_abc.jpg_&#39; within the _[value]_ slot in our parth statement.
  - If the attribute requires a reference to other elements (for example, the attributes _onTopOf_ and _below_ requires two element references, one to be above the other) then these elements are to be specified as the attribute value.
  - If the attribute does not take a value in HTML (for example, the attribute _disabled_ does not take a value), it will take a boolean value (true or false) in a parth statement.

**What do I need to know to write an action statement?**

The generalized form of an action statement is given below:

_action [(args)] tag id_

Let&#39;s parse this:

- _action_ refers to a selenium command. Commonly used selenium commands can be found [here](https://www.seleniumhq.org/docs/02_selenium_ide.jsp#commonly-used-selenium-commands).
- _[(args)]_ refers to any necessary inputs that the _action_ may take. For example, if we use the selenium action &quot;send\_keys&quot;, we must provide keys to send. If we wanted to send &#39;hello, world&#39;, the beginning of the action statement would look like: _send\_keys (&#39;hello, world&#39;)_
- _Tag id_ refers to the same notation as that described in &quot;What are assert statements?&quot; This portion of the statement will determine the type of tag which our user specifies. However, if there is no specification, then the user can simply replace the _Tag id_ with _element id. element_ being a keyword we look for.

**What do I need to know to write a function statement?**

The generalized form of a function statement is given below:

_function funcname([\*args]) returns returnvalue;_

Let&#39;s parse this:

- _Function_ is simply the word function. This is to announce to the parser that it will be creating a function, similar to the &quot;-&gt;&quot; characters before an assert statement.
- _Funcname_ represents the name of the function to be tested.
- _[\*args] represents the inputs which we want to provide to the function to test_
- _Returns_ is simply the word returns.
- _Returnvalue_ represents the value which we want the function to return on successful completion for a certain set of inputs.

**How do I finish a parth statement?**

To close a parth statement, place a semicolon after the last statement which you wish to test in a single sequence of actions. A semicolon signals the Smop team to stop the current testing sequence and proceed to the next. Semicolons may occur after just single action statements, many action statements, single assert statements, many assert statements, or any combination of action and assert statements. To see how this plays out in practice, see the examples given below.

**Introductory Examples**

**Assert Statements**

Suppose I wanted to test that the text in a header element was &#39;Foo&#39;. The parth statement is given below:

-&gt; h1 myHeader text &#39;Foo&#39;;

Suppose I wanted to test that a link with id &quot;myLink&quot; when clicked would  connect to the webpage smop.io. The parth statement is given below:

-&gt; a myLink href &#39;smop.io&#39;;

Suppose that I wanted to test that an image of id &#39;myLogo&#39; and with source &#39;test.jpg&#39; was shown above a div of id &#39;myDiv&#39; with text &#39;Bar&#39;. Because we want to test a variety of items in this prompt, many assert statements are necessary. The parth statements are given below:

-&gt; image myLogo src &#39;test.jpg&#39;;

-&gt; div myDiv text &#39;Bar&#39;;

-&gt; image myLogo onTopOf header myHeader;

**Incorporating Action Statements**

Now that assert statements are more clear (hopefully), let&#39;s look at action statements. As a refresher, while an assert statement tests for the existence of something on a webpage, action statements are designed to simulate user usage on one&#39;s webpage. These can include button clicks, link clicks, hovering a cursor over an area, scrolling - the list goes on.

To begin - suppose I wanted to test that a button with id &quot;myButton&quot; when clicked would change the width of a TextArea with id myText to be 10. We can break this into two portions - the _action_ of clicking the button, and the _assertion_ that the text area has 10 rows. The parth statement is given below:

click button myButton

 -&gt; TextArea myText rows 10;

Suppose I wanted to test that an input of the text &#39;abc123&#39; in a textarea with id &#39;myText&#39; would enable a button which had been disabled with id &#39;myButton&#39;. The action in this case is sending the keys &#39;abc123&#39;, while the assertion is checking that the button is not disabled.

Send\_keys (&#39;abc123&#39;) textArea myText

-&gt; button myButton disabled false;

**How do I test more than one action or assertion in one statement?**

As can be seen in the above examples, parth statements are not limited exclusively to single line operations. Both types of statements can be chained by newline (&#39;\n&#39;) characters. As an example, suppose we wanted to simulate the entry of username and password information into textAreas with id &#39;usernametext&#39; and &#39;passwordtext&#39;, respectively, followed by clicking a button with id &#39;login&#39;, and that we know that an element named &#39;header&#39; should have the text &#39;logged in&#39; on successful completion. The parth statement would be as follows:

send\_keys (&#39;username&#39;) textArea usernametext
send\_keys (&#39;password&#39;) textArea passwordtext
click button login
-&gt; element header text &#39;logged in&#39;;

To test multiple outcomes, we need to write multiple assert statements. However, we do not need to close the parth statement until all our attributes which we desire to be tested have been tested. For example, if we wanted to further increase our functionality to have our browser url  be changed to &#39;smop.io&#39;, the parth statement would be written as below:

send\_keys (&#39;username&#39;) textArea usernametext
send\_keys (&#39;password&#39;) textArea passwordtext
click button login
-&gt; element header text &#39;logged in&#39;

-&gt; document location &#39;smop.io&#39;;

**How do I test functions?**

Testing functions with parth statements are a bit different than assert and action statements. Essentially, if you as an owner know how you would like a function to behave in certain scenarios, you can provide us this behavior. For example, suppose you knew that you wish to have the function myFunc take in arguments of 3, 4 and 5 and return the word &#39;cat&#39;. The parth statement for this behavior is given below:

function myFunc(3,4,5) returns &#39;cat&#39;;
`
$('#docs').html(marked(docs));