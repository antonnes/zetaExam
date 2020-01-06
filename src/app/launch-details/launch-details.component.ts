import { Component, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, switchMap } from "rxjs/operators";
import { LaunchDetailsGQL } from "../services/spacexGraphql.service";

@Component({
  selector: "app-launch-details",
  templateUrl: "./launch-details.component.html",
  styleUrls: ["./launch-details.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchDetailsComponent {

  public SelectedPhoto: string = '';
  public PhotosList = [];
  public CurrentSegment = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly launchDetailsService: LaunchDetailsGQL
  ) {
    this.launchDetails$.subscribe(val => {
      this.SelectedPhoto = val.links.flickr_images[0];
      this.PhotosList = this.populatePhotosArray(val.links.flickr_images);
    });
  }

  launchDetails$ = this.route.paramMap.pipe(
    map(params => params.get("id") as string),
    switchMap(id => this.launchDetailsService.fetch({ id })),
    map(res => res.data.launch)
  );

  public ChangePhoto(segmentIndex, photoIndex) {
    this.SelectedPhoto = this.PhotosList[segmentIndex][photoIndex];
  }

  public ChangeSegment(number) {
    if(this.CurrentSegment + number >= 0 && this.CurrentSegment + number <= this.PhotosList.length-1) {
        this.CurrentSegment += number; 
        this.SelectedPhoto = this.PhotosList[this.CurrentSegment][0];
    }

    
  }

  private populatePhotosArray(originalSrc) {
    console.log(originalSrc)
    let arr = [];
    let result = [];
    for (let i = 0; i < originalSrc.length; i++) {
      const element = originalSrc[i];
      if(arr.length <= 3) {
        arr.push(element)
      } 
      if(arr.length == 3) {
        result.push(arr);
        arr = [];
      }
    }
    if(originalSrc.length % 3 != 0) {
      let arr = [];
      arr.push(originalSrc[originalSrc.length-1]);
      if(originalSrc.length % 3 == 2) arr.push(originalSrc[originalSrc.length-2]);
      result.push(arr);
    }
    console.log(result)
    return result;
  }
}
