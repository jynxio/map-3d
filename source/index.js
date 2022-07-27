/**
 * TODO
 * 实现指控：
 *    单指滑动平移地图。
 *    双指捏拉缩放地图，放大意味着相机沿着视线方向前进，缩小意味着后退。
 *    双指垂滑俯仰旋转，旋转中心是相机视线与地面的交点，旋转半径是两点间的距离，上滑俯旋，下滑仰旋，俯旋的结尾，建筑物将下沉至仅保留顶面。
 *    双指旋转旋转地图，该功能仅在3D状态下激活。
 * 模型增加条纹纹理。
 * 当缩放等级达到特定zoom级别时，方可看到3D建筑。
 * 使用Overpass API来获取地理面数据
 */

import "/style/reset.css";

import * as three from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/* ------------------------------------------------------------------------------------------------------ */
/**
 * Camera
 */
const camera = new three.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.set( - 10, 5, 20 );

/**
 * Scene
 */
const scene = new three.Scene();

scene.add(camera);

/**
 * Renderer
 */
const canvas = document.createElement( "canvas" );
const renderer = new three.WebGLRenderer( { canvas, antialias: true } );

document.body.append( canvas );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

/**
 * Controls
 */
const orbit_controls = new OrbitControls( camera, canvas );

/**
 * Resize
 */
window.addEventListener( "resize", _ => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

} );

/**
 * Render
 */
const clock = new three.Clock();

render();

function render() {

    window.requestAnimationFrame( render );

    renderer.render( scene, camera );

}

// ========================================================================== 3D map contents
/**
 * Mesh
 */
// Ground
const ground = new three.Mesh(
    new three.PlaneGeometry( 100, 100 ).rotateX( - Math.PI / 2 ),
    new three.MeshBasicMaterial( { color: 0xe4ebf2 } )
);

scene.add( ground );

// Road
const road_material = new three.MeshStandardMaterial();

const hor_road = new three.Mesh( new three.BoxGeometry( 100, 0.05, 0.5 ).translate( 0, 0.025, 0 ), road_material );
const ver_road = new three.Mesh( new three.BoxGeometry( 0.5, 0.05, 100 ).translate( 0, 0.025, 0 ), road_material );

const road = new three.Group();

road.add( hor_road, ver_road );
scene.add( road );

// Lawn
const lawn = new three.Mesh(
    new three.BoxGeometry( 40, 0.01, 40 ).translate( 0, 0.005, 0 ),
    new three.MeshStandardMaterial( { color: 0xa2e8c8 } )
);

lawn.position.x = -1 - 20;
lawn.position.z = -1 - 20;
scene.add( lawn );

// Lake
const lake = new three.Mesh(
    new three.BoxGeometry( 40, 0.01, 40 ).translate( 0, 0.005, 0 ),
    new three.MeshStandardMaterial( { color: 0x9dccff } )
);

lake.position.x = 1 + 20;
lake.position.z = 1 + 20;
scene.add( lake );

// Building lot
const building_lot = new three.Mesh(
    new three.BoxGeometry( 40, 0.01, 40 ).translate( 0, 0.005, 0 ),
    new three.MeshStandardMaterial( { color: 0xe4ebf2 } )
);

building_lot.position.x = - 1 - 20;
building_lot.position.z = 1 + 20;
scene.add( building_lot );

// Building
const building = new three.Group();
scene.add( building );

const building_material = new three.MeshStandardMaterial( { color: 0xeeeeee, transparent: true, opacity: 0.9 } );

for ( let i = 0; i < 100; i++ ) {

    const height = Math.random() * 5 + 2;
    const geometry = new three.BoxGeometry( 3, height, 3 ).translate( 0, height / 2, 0 );

    const mesh = new three.Mesh( geometry, building_material );
    mesh.position.x = i % 10 * 5 + 3;
    mesh.position.z = - Math.floor( i / 10 ) * 5 - 3;
    building.add( mesh );

}

/**
 * Light
 */
// Ambient light
const ambient_light = new three.AmbientLight( 0xffffff, 0.25 );
scene.add( ambient_light );

// Direciotnal light
const directional_light = new three.DirectionalLight( 0xffffff, 1 );
directional_light.position.set( 0, 10, 50 );
scene.add( directional_light );

// Hemisphere light
const hemisphere_light = new three.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
hemisphere_light.position.set( 0, 50, 0 );
scene.add( hemisphere_light );

/**
 * Fog
 */
const fog = new three.FogExp2( 0xbad3fc, 0.025 );
scene.fog = fog;

renderer.setClearColor( 0xbad3fc );
