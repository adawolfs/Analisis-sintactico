var arrayHelper = {
	remove : function (array, element) {
    	var index = array.indexOf(element)
    	if (index > -1) {
    		array.splice(index,1)
    	}
    	return array
    }          
}
module.exports = arrayHelper;