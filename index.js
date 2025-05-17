import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.owned) {
        handleDeleteBtnClick(e.target.dataset.owned)
    }
    else if (e.target.dataset.respond) {
        handleRespondClick(e.target.dataset.respond);
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isOwned: true,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }
}

function handleDeleteBtnClick(deleteId) {
    const indexToDelete = tweetsData.map( tweet => {return tweet.uuid} ).indexOf(deleteId);
    tweetsData.splice(indexToDelete, 1);
    render();
}

function handleRespondClick(respondId) {
    const modalContainer = document.getElementById("modal-container");

    // Grab tweet that's being replied to and insert before the text field
    const tweetToRespond = tweetsData[tweetsData.map( tweet => { return tweet.uuid} ).indexOf(respondId)];
    const responseHTML = `<div class="overlay" id="overlay"></div>
			            <div class="modal" id="modal">
                            <p class="modal-close-btn" id="modal-close-btn">X</p>
                            <div class="tweet-inner">
                                <img src="${tweetToRespond.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${tweetToRespond.handle}</p>
                                    <p class="tweet-text">${tweetToRespond.tweetText}</p>
                                </div>
                            </div>
                            <div class="tweet-input-area">
                                <img src="images/scrimbalogo.png" class="profile-pic">
                                <textarea placeholder="Reply..." id="tweet-response-input"></textarea>
                            </div>
                            <button id="tweet-reply-btn">Reply</button>
                        </div>`

    modalContainer.innerHTML = responseHTML;

    modalContainer.classList.toggle("hidden");
    const responseInput = document.getElementById("tweet-response-input");
    responseInput.focus();

    // Handling clicks within the modal
    modalContainer.addEventListener("click", (e) => {
        console.log(e.target)
        if (e.target.id === "tweet-reply-btn") {
            if (responseInput.value) {
                tweetToRespond.replies.unshift({
                    handle: `@Scrimba`,
                    profilePic: `images/scrimbalogo.png`,
                    tweetText: responseInput.value,
                })
                modalContainer.classList.add("hidden");
                responseInput.value = "";
                render();
            }
        } else if (e.target.id === "overlay" || e.target.id === "modal-close-btn") {
            e.stopPropagation();
            modalContainer.classList.add("hidden");
        }
    })


}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let ownedTweetClass = "hidden";
        if (tweet.isOwned) {
            ownedTweetClass = '';
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <div class="user-info">
                <p class="handle">${tweet.handle}</p>
                <p class="delete-btn ${ownedTweetClass}" data-owned="${tweet.uuid}">X</p>
            </div>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-reply" data-respond="${tweet.uuid}"></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

