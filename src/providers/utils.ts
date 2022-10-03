const adjectives = ["special", "large", "actual", "fair", "probable", "festive", "lonely", "waggish", "late", "dramatic", "helpless", "financial", "civil", "psychological", "unused", "unique", "colossal", "well-made", "homely", "guilty", "mountainous", "abaft", "nervous", "icky", "damp", "alert", "wet", "fearless", "icy", "organic", "first", "thoughtful", "abusive", "entertaining", "classy", "crooked", "hellish", "overrated", "aquatic", "knotty", "inquisitive", "beautiful", "evasive", "abstracted", "sparkling", "rustic", "pure", "humdrum", "bite-sized", "quizzical"]
const words = ["pot", "exempt", "utter", "key", "slow", "medal", "sugar", "threshold", "dip", "equal", "grow", "mouth", "knife", "consumer", "tree", "drug", "census", "agony", "sector", "dance", "unrest", "executrix", "roll", "colony", "eject", "flight", "housing", "orange", "alive", "packet", "congress", "hope", "test", "excuse", "ash", "girl", "concert", "gossip", "overeat", "complication", "torch", "appetite", "convenience", "habit", "ambiguity", "my", "craft", "confrontation", "leak", "peasant"]
export const randomName = () =>{
    const getrandom = (arr:string[])=>{
        return arr[Math.floor(Math.random() * arr.length)]
    }
    return `${getrandom(adjectives)}_${getrandom(words)}`
}