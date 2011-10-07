<items>
{for $node in doc("factbook")//country 
order by xs:int($node/@population) 
return <country name="{$node/@name}" population="{$node/@population}"/>
}
</items>