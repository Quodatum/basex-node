<?php
   $pw="admin";
   $ts="33281829888336";
    $md5 = hash("md5", hash("md5", $pw).$ts);
   echo $md5.chr(0);
   
?>
