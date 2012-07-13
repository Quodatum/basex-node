/* BaseX Node.js client parser
 * http://docs.basex.org/wiki/Server_Protocol
 * andy bunce 2011-2012
 * 
 * parse incoming messages from basex server
 * functions expect bufferobj to have a buffer property
 * that is yet unprocessed msg stream as string
*/

// take fields named in array flds delimited by \0 from buffer
// @param bufferObj an Object with a buffer property. The buffer is modified
// @param popStatus boolean if true read 1byte status 0/1 into ok:
// @return object or empty if message  not fully present in buffer. 
function popmsg(bufferObj,flds,popStatus){
	var i=0,last=0, buf=bufferObj.buffer,res={};
	popStatus = (typeof popStatus == 'undefined')?true:popStatus;

	while(i<buf.length && flds.length){
		if(buf[i]=="\0"){
		  res[flds.shift()]=buf.substring(i,last)
		  last=i+1;
		}
		i++;
	}
	if(flds.length>0 ||(popStatus && i==buf.length)){	
		return
	}
	if(popStatus){
		if("\0"==buf[i]){
			res["ok"]=true;
		}else if("\1"==buf[i]){
			res["ok"]=false;
		}else{
			throw "expected status marker at"+i+"="+buf.charCodeAt(i)+ ":"+buf;
		}		
		i++;
	}	
	bufferObj.buffer=buf.substring(i)
//	console.log("msg extracted, remaining: ",bufferObj.buffer.length,bufferObj.buffer)
	return res
};

exports.popmsg = popmsg;
