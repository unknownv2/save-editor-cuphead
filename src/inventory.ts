export interface PlayerInventory {
    money : number;
    newPurchase : boolean;
    _weapons : number[];
    _supers : number[];
    _charms : number[];    
}

export interface PlayerLoadout {
    primaryWeapon : number;
    secondaryWeapon : number;
    super : number;
    charm : number;
}