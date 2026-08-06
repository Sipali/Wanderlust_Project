// function wrapAsync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }
// module.exports = wrapAsync;

// write here same code using arrow function

module.exports = (fn) => {
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}