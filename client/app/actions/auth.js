
export function loginWithGoogle(){
    return()=>{
        Meteor.loginWithGoogle(err=>{
            if(err){
                alert('Error while login with google');
            }
        });
    }
}