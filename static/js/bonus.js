export let bonus = { timer: 2000, flamme: 1, speed: 1 }

var idTimerBombe = null
var idTimerFlamme = null
var idTimerSpeed = null

export const AddBonusBomb = () => {
    //console.log("le temps est augmementé de 5s");
    if (idTimerBombe != null) {
        clearTimeout(idTimerBombe);
    }
    bonus.timer = 500
    idTimerBombe = setTimeout(() => {
        bonus.timer = 2000
        //console.log("fin du bonus")
    }, 1000)
}

export const AddBonusFlamme = () => {
    //console.log("la colonne a augmenté de une pendant 5s");
    if (idTimerFlamme != null) {
        clearTimeout(idTimerFlamme);
    }
    bonus.flamme = 2
    idTimerFlamme = setTimeout(() => {
        bonus.flamme = 1
        //console.log("fin du bonus");
    }, 10000);
}
export const AddBonusSpeed = () => {
    //console.log("la colonne a augmenté de une pendant 5s");
    if (idTimerSpeed != null) {
        clearTimeout(idTimerSpeed);
    }
    bonus.speed = 2
    idTimerSpeed = setTimeout(() => {
        bonus.speed = 1
        //console.log("fin du bonus");
    }, 5000);
}