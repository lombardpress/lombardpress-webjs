import React from 'react';

/// mirador imports

import { Provider } from 'react-redux';
import PluginProvider from 'mirador/dist/es/src/extend/PluginProvider';
import createRootReducer from 'mirador/dist/es/src/state/reducers/rootReducer';
import MiradorApp from 'mirador/dist/es/src/containers/App';
//import {CollectionViewer} from 'mirador-collection-viewer';
//import {miradorImageToolsPlugin} from 'mirador-image-tools';
import settings from 'mirador/dist/es/src/config/settings';
import * as actions from 'mirador/dist/es/src/state/actions';
import createStore from 'mirador/dist/es/src/state/createStore';

class Surface extends React.Component {
  constructor(props){
    super(props)
    this.store = createStore();

  }

  UNSAFE_componentWillMount(){

      settings.id = "yolo";
      // manifest id should be retrieved from query
      // this is a temporary measure until db is corrected and query is posible
      const manifest = "http://scta.info/iiif/" + this.props.topLevel.split("/resource/")[1] + "/" + this.props.surfaceid.split("/resource/")[1].split("/")[0] + "/" + "manifest";
      
      const settings2 = {
        ...settings,
        windows: [{
          loadedManifest: manifest,
          canvasIndex: 2,
          thumbnailNavigationPosition: 'far-bottom',
        }],
        window: {
          allowClose: false,
          allowMaximize: false,
          defaultSideBarPanel: 'info',
          defaultView: 'single',
          sideBarOpenByDefault: true,
        },
        thumbnailNavigation: {
          defaultPosition: 'off',
        },
        workspace: {
          type: 'mosaic', // Which workspace type to load by default. Other possible values are "elastic"
        },
        workspaceControlPanel: {
          enabled: true,
        }
      }

      this.store.dispatch(actions.setConfig(settings2));
      this.store.dispatch(actions.fetchManifest(manifest))
      this.store.dispatch(actions.addWindow({canvasIndex: 1, sideBarOpen: false, sideBarPanel: false}))
      this.setState({store: this.store})
//
//       function select(state, manifest) {
//         return state.manifests[manifest].isFetching
//       }
//
//       let isFetching = true
//
//       function handleChange() {
//         isFetching = select(store.getState())
// console.log("isFetching", isFetching)
//         if (!isFetching) {
//
//           store.dispatch(actions.setCanvas("http://scta.info/iiif/lon/canvas/L11v", 0))
//         }
//       }
//
//       const unsubscribe = store.subscribe(handleChange)
//       unsubscribe()






  }
  UNSAFE_componentWillReceiveProps(){
    // manifest id should be retrieved from query
    // this is a temporary measure until db is corrected and query is posible
    const manifest = "http://scta.info/iiif/" + this.props.topLevel.split("/resource/")[1] + "/" + this.props.surfaceid.split("/resource/")[1].split("/")[0] + "/" + "manifest";
    this.store.dispatch(actions.fetchManifest(manifest))
    this.store.dispatch(actions.addWindow({canvasIndex: 1, sideBarOpen: false, sideBarPanel: false}))
  }
  render() {
    return (
      <div id="App">
        <Provider store={this.state.store}>
          <PluginProvider plugins={[]} createRootReducer={createRootReducer}>
            <MiradorApp />
          </PluginProvider>
        </Provider>
      </div>
    );
  }

}

export default Surface;
