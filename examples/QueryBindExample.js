
/*
 * This example shows how external variables can be bound to XQuery expressions.
 */

var basex  = require("../index");
var log = require("../debug");
//basex.debug_mode = true;
var session = new basex.Session();

// create query instance
var input = `
declare variable $item external;
declare variable $str as xs:string external;
declare variable $int as xs:integer external;
declare variable $int2 as xs:integer external;
declare variable $bool as xs:boolean external;
declare variable $bool2 as xs:boolean external;
declare variable $what as item() external :="a default value";

declare function local:about($name,$value){($name || " :" || inspect:type($value) ,$value)};

 local:about('$item',$item)
,local:about('$str',$str)
,local:about('$int',$int)
,local:about('$int2',$int2)
,local:about('$bool',$bool)
,local:about('$bool2',$bool2)
,local:about('$what',$what)
`
var query = session.query(input);

// bind variables
query.bind("item", "item","",log.print);
query.bind("str", "a string","",log.print);
query.bind("int", -1,"xs:integer",log.print);
query.bind("int2", -2,"",log.print);
query.bind("bool", true,"",log.print);
query.bind("bool2", true,"xs:boolean",log.print);
//query.bind("what", true,"badtype",log.print);
query.info(log.print);
// print results
query.execute(log.print);



// close query instance
query.close();

// close session
session.close();

