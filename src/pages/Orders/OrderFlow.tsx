import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { OrderProvider, useOrder } from '../../contexts/OrderContext';
import { Step1SelectItems } from './Step1SelectItems';
import { Step2OrderSummary } from './Step2OrderSummary';
import { Step3Invoice } from './Step3Invoice';

const STEPS = ['Select Items', 'Customer Details', 'Invoice'];

const OrderFlowContent = () => {
  const { currentStep, setCurrentStep, clearCart } = useOrder();

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleNewOrder = () => {
    clearCart();
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1SelectItems onNext={handleNext} />;
      case 2:
        return <Step2OrderSummary onNext={handleNext} onPrev={handlePrev} />;
      case 3:
        return <Step3Invoice onNewOrder={handleNewOrder} onEdit={handlePrev} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 4 }}>
     
      {/* Stepper */}
      <Stepper activeStep={currentStep - 1} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box sx={{ mb: 4 }}>{renderStepContent()}</Box>
    </Box>
  );
};

export const OrderFlow = () => {
  return (
    <OrderProvider>
      <OrderFlowContent />
    </OrderProvider>
  );
};
