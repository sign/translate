import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, Select, State, StateContext, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Pose} from '../pose/pose.state';
import {filter, tap} from 'rxjs/operators';
import {EstimateHandShape} from './hands.actions';
import {HandsService} from './hands.service';
import * as THREE from 'three';

export type HandPlane = 'wall' | 'floor';
export type HandDirection = 'me' | 'you' | 'middle';

export interface HandNormal {
  center: THREE.Vector3;
  direction: THREE.Vector3;
}

export interface HandStateModel {
  bbox: THREE.Box3;
  normal: HandNormal;
  plane: HandPlane;
  rotation: number; // Rotation in degrees [0,360]
  direction: 'me' | 'you' | 'both';
  shape: string;
}

export interface HandsStateModel {
  leftHand: HandStateModel;
  rightHand: HandStateModel;
}

const initialState: HandsStateModel = {
  leftHand: null,
  rightHand: null,
};

@Injectable()
@State<HandsStateModel>({
  name: 'hands',
  defaults: initialState
})
export class HandsState implements NgxsOnInit {
  @Select(state => state.pose.pose) pose$: Observable<Pose>;


  constructor(private handsService: HandsService, private store: Store) {

  }

  ngxsOnInit(ctx?: StateContext<any>): void {
    this.pose$.pipe(
      filter(Boolean),
      tap((pose: Pose) => {
        this.store.dispatch(new EstimateHandShape('leftHand', pose.leftHandLandmarks));
        this.store.dispatch(new EstimateHandShape('rightHand', pose.rightHandLandmarks));
      })
    ).subscribe();
  }


  @Action(EstimateHandShape)
  async estimateHand({patchState, dispatch}: StateContext<HandsStateModel>, {hand, landmarks}: EstimateHandShape): Promise<void> {
    if (!landmarks) {
      patchState({[hand]: null});
      return;
    }

    const isLeft = hand === 'leftHand';

    const vectors = landmarks.map(l => new THREE.Vector3(l.x, l.y, l.z));

    const normal = this.handsService.normal(vectors, isLeft);
    const plane = this.handsService.plane(normal);


    patchState({
      [hand]: {
        bbox: this.handsService.bbox(vectors),
        normal,
        plane,
        rotation: this.handsService.rotation(vectors),
        direction: this.handsService.direction(plane, normal, isLeft),
        shape: '񂇁' // Hand flat
        // shape: '񁲁' // Hand open
      }
    });
  }
}
