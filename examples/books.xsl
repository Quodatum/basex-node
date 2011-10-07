 <html xsl:version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform' xmlns='http://www.w3.org/1999/xhtml'>
    <body>
      <h1>Books</h1>
      <ul>
        <xsl:for-each select='books/book'>
        <li>
          <b><xsl:apply-templates select='title'/></b>: <xsl:value-of select='author[1]'/>
        </li>
        </xsl:for-each>
      </ul>
    </body>
  </html>