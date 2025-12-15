import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '699'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', 'f19'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'c90'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '1f3'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '67d'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', 'd6d'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', 'abf'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '648'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '4a3'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'de4'),
            routes: [
              {
                path: '/docs/architecture/edge-backend',
                component: ComponentCreator('/docs/architecture/edge-backend', '220'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/architecture/sim-rig-workflow',
                component: ComponentCreator('/docs/architecture/sim-rig-workflow', '668'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/assessments/capstone-humanoid',
                component: ComponentCreator('/docs/assessments/capstone-humanoid', '660'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/assessments/gazebo-project',
                component: ComponentCreator('/docs/assessments/gazebo-project', '0a6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/assessments/isaac-pipeline',
                component: ComponentCreator('/docs/assessments/isaac-pipeline', '3aa'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/assessments/ros-project',
                component: ComponentCreator('/docs/assessments/ros-project', '9ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/conversational-robotics',
                component: ComponentCreator('/docs/conversational-robotics', '007'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/foundations',
                component: ComponentCreator('/docs/foundations', '09f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/gazebo-unity',
                component: ComponentCreator('/docs/gazebo-unity', 'b72'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hardware/digital-twin-workstation',
                component: ComponentCreator('/docs/hardware/digital-twin-workstation', '9a3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/hardware/jetson-edge-kit',
                component: ComponentCreator('/docs/hardware/jetson-edge-kit', '391'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/humanoid-robotics',
                component: ComponentCreator('/docs/humanoid-robotics', '69d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'aed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/introduction',
                component: ComponentCreator('/docs/introduction', '457'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/nvidia-isaac',
                component: ComponentCreator('/docs/nvidia-isaac', '337'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/ros2',
                component: ComponentCreator('/docs/ros2', '7c3'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'f6f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
