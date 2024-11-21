import React from 'react';
import './index.css';
import { OrderType, orderTypeDisplayName } from '../../../../../types';

/**
 * Interface representing the props for the OrderButton component.
 *
 * name - The text to be displayed on the button.
 * setQuestionOrder - A function that sets the order of questions based on the message.
 * isActive - A boolean value that determines if the button is active.
 */
interface OrderButtonProps {
  orderType: OrderType;
  setQuestionOrder: (order: OrderType) => void;
  isActive: boolean;
}

/**
 * OrderButton component renders a button that, when clicked, triggers the setQuestionOrder function
 * with the provided message.
 * It will update the order of questions based on the input message.
 *
 * @param orderType - The label for the button and the value passed to setQuestionOrder function.
 * @param setQuestionOrder - Callback function to set the order of questions based on the input message.
 * @param isActive - A boolean value that determines if the button is active.
 */
const OrderButton = ({ orderType, setQuestionOrder, isActive }: OrderButtonProps) => (
  <button
    className={`btn ${isActive ? 'btn_selected' : ''}`}
    onClick={() => {
      setQuestionOrder(orderType);
    }}>
    {orderTypeDisplayName[orderType]}
  </button>
);

export default OrderButton;
