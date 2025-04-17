import type { InstallationStep } from '../types/vendor';

export const installationSteps: InstallationStep[] = [
  {
    id: 'prep-1',
    title: 'Site Assessment',
    description: 'Evaluate roof condition and mounting locations',
    category: 'preparation',
    required: true,
    completed: false
  },
  {
    id: 'prep-2',
    title: 'Safety Setup',
    description: 'Install safety equipment and prepare workspace',
    category: 'preparation',
    required: true,
    completed: false
  },
  {
    id: 'mount-1',
    title: 'Install Mounting Rails',
    description: 'Attach mounting rails to roof structure',
    category: 'mounting',
    required: true,
    completed: false
  },
  {
    id: 'mount-2',
    title: 'Panel Placement',
    description: 'Position and secure solar panels',
    category: 'mounting',
    required: true,
    completed: false,
    dependsOn: ['mount-1']
  },
  {
    id: 'elec-1',
    title: 'Wiring Installation',
    description: 'Install and connect system wiring',
    category: 'electrical',
    required: true,
    completed: false,
    dependsOn: ['mount-2']
  },
  {
    id: 'elec-2',
    title: 'Grounding Setup',
    description: 'Install grounding system components',
    category: 'electrical',
    required: true,
    completed: false
  },
  {
    id: 'final-1',
    title: 'System Testing',
    description: 'Test all connections and system functionality',
    category: 'finalization',
    required: true,
    completed: false,
    dependsOn: ['elec-1', 'elec-2']
  },
  {
    id: 'final-2',
    title: 'Documentation',
    description: 'Complete system documentation and permits',
    category: 'finalization',
    required: true,
    completed: false
  }
];