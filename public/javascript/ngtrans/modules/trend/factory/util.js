/**
 * Created by Xiumin on 2018/1/22.
 */
// util
app.factory('Util', function() {
    let service = {};
    // uuid
    let count =0;
    service.uuid = function(){
        count += 1;
        return count.valueOf();
    };
    return service;
});