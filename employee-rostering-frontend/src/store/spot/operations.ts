/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ThunkCommandFactory } from '../types';
import * as actions from './actions';
import { showSuccessMessage, showErrorMessage } from 'ui/Alerts';
import Spot from 'domain/Spot';
import { SetSpotListLoadingAction, AddSpotAction, RemoveSpotAction, UpdateSpotAction, RefreshSpotListAction } from './types';

export const addSpot: ThunkCommandFactory<Spot, AddSpotAction> = spot =>
  (dispatch, state, client) => {
    const tenantId = spot.tenantId;
    return client.post<Spot>(`/tenant/${tenantId}/spot/add`, spot).then(newSpot => {
      showSuccessMessage("Successfully added Spot", `The Spot "${newSpot.name}" was successfully added.`)
      dispatch(actions.addSpot(newSpot))
    });
  };

export const removeSpot: ThunkCommandFactory<Spot, RemoveSpotAction> = spot =>
  (dispatch, state, client) => {
    const tenantId = spot.tenantId;
    const spotId = spot.id;
    return client.delete<boolean>(`/tenant/${tenantId}/spot/${spotId}`).then(isSuccess => {
      if (isSuccess) {
        showSuccessMessage("Successfully deleted Spot", `The Spot "${spot.name}" was successfully deleted.`)
        dispatch(actions.removeSpot(spot));
      }
      else {
        showErrorMessage("Error deleting Spot", `The Spot "${spot.name}" could not be deleted.`);
      }
    });
  };

export const updateSpot: ThunkCommandFactory<Spot, UpdateSpotAction> = spot =>
  (dispatch, state, client) => {
    const tenantId = spot.tenantId;
    return client.post<Spot>(`/tenant/${tenantId}/spot/update`, spot).then(updatedSpot => {
      showSuccessMessage("Successfully updated Spot", `The Spot with id "${spot.id}" was successfully updated.`);
      dispatch(actions.updateSpot(updatedSpot));
    });
  };

export const refreshSpotList: ThunkCommandFactory<void, SetSpotListLoadingAction | RefreshSpotListAction> = () =>
  (dispatch, state, client) => {
    const tenantId = state().tenantData.currentTenantId;
    dispatch(actions.setIsSpotListLoading(true));
    return client.get<Spot[]>(`/tenant/${tenantId}/spot/`).then(spotList => {
      dispatch(actions.refreshSpotList(spotList));
      dispatch(actions.setIsSpotListLoading(false));
    });
  };
