var Rec14 = Rec14 || {};

//based on http://addyosmani.com/blog/essential-js-namespacing/
//Rec14.extend = function ( ns, ns_string ) {
//    var parts = ns_string.split('.'),
//        parent = ns,
//        pl, i;
//    if (parts[0] == "Rec14") {
//        parts = parts.slice(1);
//    }
//    pl = parts.length;
//    for (i = 0; i < pl; i++) {
//        //create a property if it doesnt exist
//        if (typeof parent[parts[i]] == 'undefined') {
//            parent[parts[i]] = {};
//        }
//        parent = parent[parts[i]];
//    }
//    return parent;
//}


// based on https://github.com/documentcloud/underscore/blob/bf657be243a075b5e72acc8a83e6f12a564d8f55/underscore.js#L767
Rec14.extend = function ( obj, source ) {
    // ECMAScript5 compatibility based on: http://www.nczonline.net/blog/2012/12/11/are-your-mixins-ecmascript-5-compatible/
    if ( Object.keys ) {
        var keys = Object.keys( source );
        
        for (var i = 0, il = keys.length; i < il; i++) {
            var prop = keys[i];
            Object.defineProperty( obj, prop, Object.getOwnPropertyDescriptor( source, prop ) );
        }
    } else {
        var safeHasOwnProperty = {}.hasOwnProperty;
        for ( var prop in source ) {
            if ( safeHasOwnProperty.call( source, prop ) ) {
                obj[prop] = source[prop];
            }
        }
    }
    
    console.log (obj);
    return obj;
};