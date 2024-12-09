import React, { useContext } from "react";
import { Button } from '@mui/material';
import { VisibilityContext } from "react-horizontal-scrolling-menu";

const Arrow = ({ children, onClick, isFirstItemVisible }) => {
  return (
    <Button
      disabled={isFirstItemVisible}
      onClick={onClick}
    >
      {children}
    </Button>);
};
export const LeftArrow = () => {
  const visibility = useContext(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible('first', true);
  return <Arrow
    sx={{
      position: 'absolute',
      zIndex: '999',
      height: '100vh',
      width: '20px',
    }} className="left" onClick={() => { visibility.scrollPrev(); console.log('prev work!') }} isFirstItemVisible={isFirstItemVisible}>←</Arrow>
}
export const RightArrow = () => {
  const visibility = useContext(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible('last', false);
  return <Arrow
    sx={{
      position: 'absolute',
      zIndex: '999',
      height: '100vh',
      width: '20px',
    }} className="right" onClick={() => { visibility.scrollNext(); console.log('next work!') }} isFirstItemVisible={isFirstItemVisible}>→</Arrow>
}