import { IPortalConstructor } from '../interfaces/portal.interface';
import { IPortalDestination } from '../interfaces/portal-destination.interface';

export class Portal extends Phaser.GameObjects.Zone {
  body: Phaser.Physics.Arcade.Body;
  private portalDestinationForMario: IPortalDestination;
  public getPortalDestination(): IPortalDestination {
    return this.portalDestinationForMario;
  }
  constructor(aParams: IPortalConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.width, aParams.height);
    this.portalDestinationForMario = aParams.spawn;
    this.scene.physics.world.enable(this);
    this.body.setSize(this.height, this.width);
    this.body.setOffset(6, -5);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.scene.add.existing(this);
  }
}
