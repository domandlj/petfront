import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import {WalkState} from './Types';  

const steps: string[] = [
  "Recién comprado",
  "Yendo a por el perro",
  "En marcha",
  "Yendo a devolver el perro",
  "Fin",
];

const stateToStepMap: { [key in WalkState]: number } = {
  JustBought: 0,
  GoingToPickUpDog: 1,
  Running: 2,
  WaitingForWalkEnd: 3, 
  GoingToBringBackDog: 3,
  Terminated: 4,
};

interface WalkStepperProps {
  currentState: WalkState;
}

function VerticalWalkStepper({ currentState }: WalkStepperProps) {
  const stepIndex = stateToStepMap[currentState] ?? 0; // Fallback to 0 if state is invalid

  return (
    <Box>
      <Stepper
        sx={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
        activeStep={stepIndex}
        orientation="horizontal"
        alternativeLabel
      >
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                color: 'white',
                '& .MuiStepLabel-label.Mui-active':{color:'white'},
                '& .MuiStepLabel-label.Mui-completed':{color:'white'},
                '& .MuiStepLabel-label': { color: 'white' }, // Default text color
                '& .Mui-completed .MuiStepLabel-label': { color: 'white' }, // Completed step text color
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}


export default VerticalWalkStepper;
