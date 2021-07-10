let blackjackgame = {
    'you' : {'scoreSpan':'#your-blackjack-result','div':'#your-box','score':0} ,
    'dealer' : {'scoreSpan':'#dealer-blackjack-result','div':'#dealer-box','score':0},
    'cards' : ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
    'cardsmap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
    'wins':0,
    'losses':0,
    'draws':0,
    'isstand':false,
    'turnsover': false,

    
 };
 
 const YOU = blackjackgame['you']
 const DEALER = blackjackgame['dealer']
 const hitsound = new Audio('../blackjack_assets/sounds/swish.m4a');
 const winsound= new Audio('../blackjack_assets/sounds/cash.mp3');
 const losesound= new Audio('../blackjack_assets/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click',blackjackhit);        // css selector
document.querySelector('#blackjack-deal-button').addEventListener('click',blackjackDeal);
document.querySelector('#blackjack-stand-button').addEventListener('click',blackjackStand);


function blackjackhit(){
    if (blackjackgame['isstand']===false){
        let card= randomcard();
        showcard(card,YOU);
        updatescore(card,YOU);
        showscore(YOU);
}
}
function randomcard(){
    let randomindex = blackjackgame['cards'][Math.floor(Math.random()*13)];
    return randomindex;
}

function showcard(card,activeplayer){
    if (activeplayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = '../blackjack_assets/images/'+card+'.png';
        document.querySelector(activeplayer['div']).appendChild(cardImage);
        hitsound.play();
    }
}



function blackjackDeal(){
    if (blackjackgame['turnsover'] === true){
        blackjackgame['isstand'] = false;
        let yourImages =  document.querySelector('#your-box').querySelectorAll('img');   // selects all the images produced in your-box div
        let dealerImages =  document.querySelector('#dealer-box').querySelectorAll('img');   

        for (let i=0;i<yourImages.length;i++){
            yourImages[i].remove();
        }

        for (let i=0;i<dealerImages.length;i++){
            dealerImages[i].remove();
        }
        YOU['score']=0;
        DEALER['score']=0;
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).textContent = 0;

        document.querySelector(YOU['scoreSpan']).style.color = '#ffffff';
        document.querySelector(DEALER['scoreSpan']).style.color = '#ffffff';

        document.querySelector('#blackjack-result').textContent="Let's play!" ;
        document.querySelector('#blackjack-result').style.color="black" ;
        blackjackgame['turnsover']=false;
        }
}

function updatescore(card,activeplayer){
    //If on adding 11, score is <21 add 11 else add 1.
    if (card === 'A'){         //strict check
    if (activeplayer['score']+ blackjackgame['cardsmap'][card[1]]<=21){
        activeplayer['score'] += blackjackgame['cardsmap'][card[1]]; 
    }
    else{
        activeplayer['score'] += blackjackgame['cardsmap'][card][0];
    }
 }
 else{
    activeplayer['score'] += blackjackgame['cardsmap'][card];
}
}

function showscore(activeplayer){
    if(activeplayer['score']>21){
        document.querySelector(activeplayer['scoreSpan']).textContent = "BUSTED!";
        document.querySelector(activeplayer['scoreSpan']).style.color = "red"; 
    } else{
    document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score'];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function blackjackStand(){
    blackjackgame['isstand']=true;
    while (DEALER['score']<16 &&  blackjackgame['isstand']===true){
        let card= randomcard();
        showcard(card,DEALER);
        updatescore(card,DEALER);
        showscore(DEALER);
        await sleep(1000);
    }


    blackjackgame['turnsover']=true;
    let winner= decidewinner();
    showresult(winner);
}



function decidewinner(){
    let winner;

    if (YOU['score']<=21){
        // higher score than dealer or when dealer busts but you're still in
        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)){
            blackjackgame['wins']++; 
            winner=YOU;
        }
        else if (YOU['score'] < DEALER['score']){
            blackjackgame['losses']++; 
            winner=DEALER;
        }
        else if (YOU['score'] === DEALER['score']){
            blackjackgame['draws']++; 
        }

        //When you bust but dealer doesn't 

        else if(YOU['score'] > 21 && DEALER['score'] <= 21){
            blackjackgame['losses']++; 
            winner=DEALER;        
        }
    }

        //when both bust
        else if((YOU['score'] > 21) && (DEALER['score'] > 21)){
            blackjackgame['draws']++; 
        }

    return winner;
}

function showresult(winner){
    let message,messagecolor;
if (blackjackgame['turnsover'] === true){
        if (winner==YOU){
            document.querySelector('#wins').textContent= blackjackgame['wins'];
            message="You Won!";
            messagecolor= 'green';
            winsound.play();
        }
        else if (winner==DEALER){
            document.querySelector('#losses').textContent= blackjackgame['losses'];
            message="You Lost!";
            messagecolor= 'red';
            losesound.play();
        }
        else{
            document.querySelector('#draws').textContent= blackjackgame['draws'];
            message="You Drew!";
            messagecolor='black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messagecolor;
    }
} 