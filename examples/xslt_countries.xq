let $in :=
 <items>
{for $node in doc("factbook")//country 
order by xs:int($node/@population) 
return <country name="{$node/@name}" population="{$node/@population}"/>
}
</items>

let $style :=
   <html xsl:version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns='http://www.w3.org/1999/xhtml'>
    <body>
      <h1>Countries</h1>
      <ul>
        <xsl:for-each select='items/country'>
        <li>
          <b><xsl:value-of select='@name'/></b>: <xsl:value-of select='@population'/>
        </li>
        </xsl:for-each>
      </ul>
    </body>
  </html>
return xslt:transform($in, $style)