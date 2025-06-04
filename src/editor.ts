import { SaveEditor, Stream } from 'libvantage';

import { PlayerInventory, PlayerLoadout } from './inventory';

import weapons from './weapons';
import charms from './charms';
import supers from './supers';


enum Players {
    cuphead = 1,
    mugman = 2
}

export class Editor implements SaveEditor{
    private buffer: Buffer;

    private inventories : PlayerInventory[];
    private loadouts : PlayerLoadout[];
    private saveData : any;

    public availableWeapons = weapons.map(weapon => ({
        label: weapon.name,
        value: weapon.model,
    }));
    public availableCharms = charms.map(charm => ({
        label: charm.name,
        value: charm.value,
    }));
    public availableSupers = supers.map(sup => ({
        label: sup.name,
        value: sup.value,
    }));    
    public load(buffer: Buffer) {
        this.buffer = buffer;

        const stream = new Stream(buffer);

        stream.position = 0;
        const saveText = stream.readString("utf8", stream.length) ;

        let obj = JSON.parse(saveText);

        this.saveData = obj;

        // read player data
        this.inventories = []
        this.inventories[Players.cuphead] = <PlayerInventory>obj.inventories.playerOne;
        this.inventories[Players.mugman] = <PlayerInventory>obj.inventories.playerTwo;
    
        this.loadouts = [];
        this.loadouts[Players.cuphead] = <PlayerLoadout>(obj.loadouts.playerOne);
        this.loadouts[Players.mugman] = <PlayerLoadout>(obj.loadouts.playerTwo);      
        
    }
    
    public save(): Buffer {
        // write player data back
        this.saveData.loadouts.playerOne = this.loadouts[Players.cuphead];
        this.saveData.loadouts.playerTwo = this.loadouts[Players.mugman];

        const stringData = JSON.stringify(this.saveData);
        const buffer = Buffer.from(stringData, "utf8");
        return buffer;
    }
    public maxMoney(playerId : number) : void {
        this.inventories[playerId].money = 60;
    }

    public addAllWeapons(playerId : number) : void {
        const weapons = this.availableWeapons.filter( s => s.label !== 'Empty');                
        weapons.forEach( weapon => {
            if(!this.inventories[playerId]._weapons.includes(weapon.value)) {
                this.inventories[playerId]._weapons.push(weapon.value);
            }
        });
    }
    public addAllCharms(playerId : number) : void {
        const charms = this.availableCharms.filter( s => s.label !== 'Empty');        
        charms.forEach( charm => {
            if(!this.inventories[playerId]._charms.includes(charm.value)) {
                this.inventories[playerId]._charms.push(charm.value);
            }
        });
    }
    public addAllSupers(playerId : number) : void {
        const supers = this.availableSupers.filter( s => s.label !== 'Empty');
        supers.forEach( sup => {
            if(!this.inventories[playerId]._supers.includes(sup.value)) {
                this.inventories[playerId]._supers.push(sup.value);
            }
        });
    }        
}