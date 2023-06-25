export class UserFlow {
  register: boolean = false;
  confirmDetails: boolean = false;
  createEvent: boolean = false;
  planners: boolean = false;
  settings: boolean = false;
  onGoing: boolean = false;

  constructor(flow: UserFlow) {
    this.register = flow?.register || false;
    this.confirmDetails = flow?.confirmDetails || false;
    this.createEvent = flow?.createEvent || false;
    this.planners = flow?.planners || false;
    this.settings = flow?.settings || false;
    this.onGoing = flow?.onGoing || false;
  }
}
