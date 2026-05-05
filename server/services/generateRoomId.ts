function createRoomId(){
    let characters  = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];    
    let nums = ['0','1','2','3','4','5','6','7','8','9'];
    let roomId = '';
    for(let i = 0 ; i<5;i++){
        if(i&1){
            roomId+=characters[Math.floor(Math.random()*characters.length)];
        }else{
            roomId+=nums[Math.floor(Math.random()*nums.length)];
        }
    }
    return roomId;
    
}
export default createRoomId;