import * as THREE from './vendor/three.js-master/build/three.module.js';
import Stats from './vendor/three.js-master/examples/jsm/libs/stats.module.js';
import {OrbitControls} from './vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './vendor/three.js-master/examples/jsm/loaders/FBXLoader.js'; 

const Scene = {
    vars: {
        container: null,
        scene: null,
        renderer: null,
        camera: null,
        mouse: new THREE.Vector2(),
        raycaster: new THREE.Raycaster(),
        animPurcent: 0,
        clock: new THREE.Clock(),
        delta: 0 //units a second
    },
    init:() => {
        let vars = Scene.vars;

        //Préparer le container
        vars.container = document.createElement('div');
        vars.container.classList.add("fullsceen");
        document.body.appendChild(vars.container);

        //Création de la scène
        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0xa0a0a0);

        //Moteur de rendus
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.container.appendChild(vars.renderer.domElement);
        vars.renderer.shadowMap.enabled = true;
        vars.renderer.shadowMapSoft = true;
        
        //Création de la caméra
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        vars.camera.position.set(-1.5, 210, 572);

        //Création de la lumière
        let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 0.7);
        light.position.set(0, 700, 0);
        vars.scene.add(light);

        //Création du sol
        let sol = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000,2000), new THREE.MeshLambertMaterial({ color: new THREE.Color(0xCCCCCC) }));
        sol.rotation.x = - Math.PI / 2;
        sol.receiveShadow = false;
        vars.scene.add(sol);

        let planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0.07;
        let shadowPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), planeMaterial);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.receiveShadow = true;
        vars.scene.add(shadowPlane);

        //Texture du sol - Grid Helper
        let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        vars.scene.add(grid);

        //Création de la bulle
        let geometry = new THREE.SphereGeometry(1000, 32, 32);
        let material = new THREE.MeshStandardMaterial({color: 0xffffff});
        material.side = THREE.DoubleSide;
        let sphere = new THREE.Mesh(geometry, material);
        vars.scene.add(sphere);

        //Création du bouton

            //Base
            var geometryCylinder = new THREE.CylinderGeometry( 20, 20, 30, 32 );
            var materialCylinder = new THREE.MeshBasicMaterial( {color: 0x333333} );
            var cylinder = new THREE.Mesh( geometryCylinder, materialCylinder );
            cylinder.position.z = 60;
            vars.scene.add(cylinder);

            //Bouton

            var geometryButton = new THREE.SphereGeometry(25, 32, 32, 0, Math.PI * 2, 0, 0.75);
            var materialButton = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
            var button = new THREE.Mesh( geometryButton, materialButton );
            button.position.z = 60;
            vars.scene.add(button);

            //Texte

            // var geometryText = new THREE.TextGeometry('Clown Party', {
            //     size: 5,
			// 	height: 0.8,
			// 	font: 'helvetiker',
			// 	weight: 'normal',
			// 	style: 'normal'
            // })

        //Chargement des textures
        vars.texture = new THREE.TextureLoader().load('./texture/marbre.jpg');

        //Récupération du texte
        let hash = document.location.hash.substr(1);
        if (hash.length !== 0) {
            Scene.vars.text = decodeURI(hash.substring());
        } else {
            Scene.vars.text = "DAWIN";
        }

        //Chargement des objets
        Scene.loadFBX("Socle_Partie1.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "socle1", () => {
            Scene.loadFBX("Socle_Partie2.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "socle2", () => {
                Scene.loadFBX("Statuette.FBX", 10, [0, 0, 0], [0, 0, 0], 0xFFD700, "statuette", () => {
                    Scene.loadFBX("Plaquette.FBX", 10, [0, 4, 45], [0, 0, 0], 0xFFFFFF, "plaquette", () => {
                        Scene.loadFBX("Logo_Feelity.FBX", 10, [45, 22, 0], [0, 0, 0], 0xFFFFFF, "logo1", () => {
                            Scene.loadText(Scene.vars.text, 10, [0, 23, 46], [0, 0, 0], 0x1A1A1A, "texte", () => {

                                //Positionnement du trophée
                                let trophy = new THREE.Group();
                                trophy.add(Scene.vars.socle1);
                                trophy.add(Scene.vars.socle2);
                                trophy.add(Scene.vars.statuette);
                                trophy.add(Scene.vars.plaquette);
                                trophy.add(Scene.vars.logo1);
                                trophy.add(Scene.vars.texte);
                                
                                let logo2 = Scene.vars.logo1.clone();
                                logo2.position.x = -45;
                                logo2.rotation.z = Math.PI;
                                trophy.add(logo2);

                                let trophy2 = trophy.clone();
                                let trophy3 = trophy.clone();

                                vars.scene.add(trophy);
                                vars.scene.add(trophy2);
                                vars.scene.add(trophy3);

                                trophy.position.z = -50;
                                trophy.position.y = 10;
                                Scene.vars.goldGroup = trophy;

                                trophy2.position.x = -200;
                                trophy2.position.y = 10;
                                trophy2.rotation.y = (Math.PI)/4
                                trophy2.children[2].traverse(node => {
                                    if (node.isMesh) {
                                        node.material = new THREE.MeshStandardMaterial({
                                            color: new THREE.Color(0xC0C0C0),
                                            roughness: .3,
                                            metalness: .6
                                        });
                                    }
                                });
                                Scene.vars.silverGroup = trophy2;

                                trophy3.position.x = 200;
                                trophy3.position.y = 10;
                                trophy3.rotation.y = -(Math.PI)/4
                                trophy3.children[2].traverse(node => {
                                    if (node.isMesh) {
                                        node.material = new THREE.MeshStandardMaterial({
                                            color: new THREE.Color(0xCD7F32),
                                            roughness: .3,
                                            metalness: .6
                                        });
                                    }
                                });
                                Scene.vars.bronzeGroup = trophy3;

                                document.querySelector('#loading').remove();

                                Scene.vars.animSpeed = -0.05;

                                //Ajout de la lumière
                                let lightIntensity = 0.25;

                                let directional = new THREE.DirectionalLight(0xffffff, lightIntensity);
                                let helper = new THREE.DirectionalLightHelper(directional, 5);
                                directional.position.set(0, 700, 200);

                                let light1 = new THREE.DirectionalLight(0xffffff, lightIntensity);
                                let helper1 = new THREE.DirectionalLightHelper(light1, 5);
                                light1.position.set(0,50,100);
                                light1.target = Scene.vars.goldGroup;
                                light1.name = "light1";

                                let light2 = new THREE.DirectionalLight(0xffffff, lightIntensity);
                                let helper2 = new THREE.DirectionalLightHelper(light2, 5);
                                light2.position.set(-75,50,100);
                                light2.target = Scene.vars.silverGroup;

                                let light3 = new THREE.DirectionalLight(0xffffff, lightIntensity);
                                let helper3 = new THREE.DirectionalLightHelper(light3, 5);
                                light3.position.set(75,50,100);
                                light3.target = Scene.vars.bronzeGroup;

                                vars.scene.add(directional);
                                vars.scene.add(helper);
                                vars.scene.add(light1);
                                vars.scene.add(helper1);
                                vars.scene.add(light2);
                                vars.scene.add(helper2);
                                vars.scene.add(light3);
                                vars.scene.add(helper3);

                                //Ajout des ombres
                                directional.castShadow = true;
                                light1.castShadow = true;
                                light2.castShadow = true;
                                light3.castShadow = true;
                                let d = 1000;

                                directional.shadow.camera.left = -d;
                                directional.shadow.camera.right = d;
                                directional.shadow.camera.top = d;
                                directional.shadow.camera.bottom = -d;
                                directional.shadow.camera.far = 2000;
                                directional.shadow.mapSize.width = 4096;
                                directional.shadow.mapSize.height = 4096;

                                light1.shadow.camera.left = -d;
                                light1.shadow.camera.right = d;
                                light1.shadow.camera.top = d;
                                light1.shadow.camera.bottom = -d;
                                light1.shadow.camera.far = 2000;
                                light1.shadow.mapSize.width = 4096;
                                light1.shadow.mapSize.height = 4096;
                                
                                light2.shadow.camera.left = -d;
                                light2.shadow.camera.right = d;
                                light2.shadow.camera.top = d;
                                light2.shadow.camera.bottom = -d;
                                light2.shadow.camera.far = 2000;
                                light2.shadow.mapSize.width = 4096;
                                light2.shadow.mapSize.height = 4096;

                                light3.shadow.camera.left = -d;
                                light3.shadow.camera.right = d;
                                light3.shadow.camera.top = d;
                                light3.shadow.camera.bottom = -d;
                                light3.shadow.camera.far = 2000;
                                light3.shadow.mapSize.width = 4096;
                                light3.shadow.mapSize.height = 4096;
                            });
                        });
                    });
                });
            });
        });

        window.addEventListener('resize', Scene.onWindowResize, false);

        window.addEventListener('mousemove', Scene.onMouseMove, false); 

        //Mise en place des controles et des limites
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        vars.controls.minDistance = 300;
        vars.controls.maxDistance = 600;
        vars.controls.minPolarAngle = Math.PI / 4;
        vars.controls.maxPolarAngle = Math.PI / 2;
        vars.controls.minAzimuthAngle = - Math.PI / 4;
        vars.controls.maxAzimuthAngle = Math.PI / 4;
        vars.controls.target.set(0, 100, 0);
        vars.controls.update();

        //Ajout des stats
        vars.stats = new Stats();
        vars.container.appendChild(vars.stats.dom);

        Scene.animate();

    },
    loadFBX: (file, scale, position, rotation, color, namespace, callback) => {
        let loader = new FBXLoader();
        
        if(file === undefined) {
            return;
        }
        loader.load('./fbx/' + file, (object) => {
            let data = object;

            data.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    if (namespace === "plaquette"){
                        node.material = new THREE.MeshBasicMaterial({
                            map: Scene.vars.texture
                        });
                    }
                    if (namespace === "statuette"){
                        node.material = new THREE.MeshStandardMaterial({
                            color: new THREE.Color(color),
                            roughness: .3,
                            metalness: .6
                        });
                    }
                    node.material.color = new THREE.Color(color);
                }
            });

            data.position.x = position[0];
            data.position.y = position[1];
            data.position.z = position[2];

            data.rotation.x = rotation[0];
            data.rotation.y = rotation[1];
            data.rotation.z = rotation[2];

            data.scale.x = data.scale.y = data.scale.z = scale;

            Scene.vars[namespace] = data;

            callback();
        });
    },
    loadText: (text, scale, position, rotation, color, namespace, callback) => {
        let loader = new THREE.FontLoader();

        loader.load('./vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            let geometry = new THREE.TextGeometry(text, {
                font: font,
                size: 1,
                height: 0.1,
                curveSegments: 1,
                bevelThickness: 1,
                bevelSize: 1,
                bevelEnabled: false,
                text: null
                }
            );

            geometry.computeBoundingBox();
            let offset = geometry.boundingBox.getCenter().negate();
            geometry.translate( offset.x, offset.y, offset.z );

            let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color : new THREE.Color(color)}));
            
            mesh.position.x = position[0];
            mesh.position.y = position[1];
            mesh.position.z = position[2];

            mesh.rotation.x = rotation[0];
            mesh.rotation.y = rotation[1];
            mesh.rotation.z = rotation[2];

            mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

            Scene.vars[namespace] = mesh;

            callback();
        });
    },
    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    },
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);
        if (Scene.vars.goldGroup != undefined){
            var intersects = Scene.vars.raycaster.intersectObjects( Scene.vars.goldGroup.children, true );
            if (intersects.length > 0) {
                Scene.vars.animSpeed = 0.05;
                Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;
            } else {
                Scene.vars.animSpeed = -0.05;
                Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;
            }
            if (Scene.vars.animPurcent > 0.01 && Scene.vars.animPurcent < 0.99) {
                Scene.customAnimation();
            } else if (Scene.vars.animPurcent >= 0.99) {
                Scene.vars.animPurcent = 1;
            } else if (Scene.vars.animPurcent <= 0.01) {
                Scene.vars.animPurcent = 0;
            }
        }
    },
    onMouseMove: () => {
        Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    customAnimation: () => {
        let base = 24 * Scene.vars.animSpeed;

        //Plaquette
        if(Scene.vars.animPurcent > 0.1 && Scene.vars.animPurcent <= 0.33) {
            Scene.vars.goldGroup.children[3].translateZ(base * 3);
            Scene.vars.goldGroup.children[5].translateZ(base*6);
        } else if (Scene.vars.animPurcent <= 0.1) {
            Scene.vars.goldGroup.children[3].position.z = 45;
            Scene.vars.goldGroup.children[5].position.z = 46;
        }

        //Socle
        if(Scene.vars.animPurcent >= 0.2 && Scene.vars.animPurcent <= 0.75) {
            Scene.vars.goldGroup.children[0].translateX(base * 2);
            Scene.vars.goldGroup.children[1].translateX(base * (-2));
        } else if (Scene.vars.animPurcent < 0.2) {
            Scene.vars.goldGroup.children[0].position.x = 0;
            Scene.vars.goldGroup.children[1].position.x = 0;
        }

        //Logo
        if(Scene.vars.animPurcent >= 0.2 && Scene.vars.animPurcent <= 0.75) {
            Scene.vars.goldGroup.children[4].translateX(base * 3);
            Scene.vars.goldGroup.children[6].translateX(base * 3);
        } else if (Scene.vars.animPurcent < 0.2) {
            Scene.vars.goldGroup.children[4].position.x = 45;
            Scene.vars.goldGroup.children[6].position.x = -45;
        }

        //Statuette
        if(Scene.vars.animPurcent >= 0.4) {
            Scene.vars.goldGroup.children[2].translateY(base * 3);
        } else if (Scene.vars.animPurcent < 0.7) {
            Scene.vars.goldGroup.children[2].position.y = 0;
        }
    },
    clown_party: () => {
        Scene.vars.delta = Scene.vars.clock.getDelta();
        if (Scene.vars.delta%4 == 0) {
            console.log(Scene.vars.scene.children.length);
            // Scene.vars.scene.children[10].visible = false;
            // Scene.vars.scene.children[12].visible = false;
            // Scene.vars.scene.children[14].visible = false;
        } else if (Scene.vars.delta%4 == 2) {
            // Scene.vars.scene.children[10].visible = true;
            // Scene.vars.scene.children[12].visible = true;
            // Scene.vars.scene.children[14].visible = true;
        }
        
    }
};

Scene.init();