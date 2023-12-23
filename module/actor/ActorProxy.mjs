
import {Character} from "./character/Character.mjs";
import {Npc} from "./npc/Npc.mjs";
import {BaseActor} from "./BaseActor.mjs";

/**
 * @typedef {Character, Npc} FUActor
 */

/**
 * @type {Readonly<{npc: Npc, character: Character}>}
 */
//Provide a type string to class object mapping to keep our code clean
const actorMappings = Object.freeze({
    character: Character,
    npc: Npc,
});

export const ActorProxy = new Proxy(BaseActor, {
    //Will intercept calls to the "new" operator
    construct: function (target, args) {
        const [data] = args;

        //Handle missing mapping entries
        if (!actorMappings.hasOwnProperty(data.type))
            throw new Error("Unsupported Actor type: " + data.type);

        //Return the appropriate, actual object from the right class
        return new actorMappings[data.type](...args);
    }
});