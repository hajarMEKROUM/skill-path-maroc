import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProposalModal from '../ProposalModal';
import useFreelanceStore from '../../../store/freelanceStore';

// Mock the Zustand store
vi.mock('../../../store/freelanceStore');

describe('ProposalModal', () => {
  const mockSubmitProposal = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default store state mock
    useFreelanceStore.mockReturnValue({
      proposalModalOpen: true,
      closeProposalModal: mockCloseModal,
      submitProposal: mockSubmitProposal,
      isSubmittingProposal: false,
    });
  });

  it('renders the modal when open', () => {
    render(<ProposalModal />);
    expect(screen.getByText('Submit Proposal')).toBeInTheDocument();
    expect(screen.getByLabelText(/Bid Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cover Letter/i)).toBeInTheDocument();
  });

  it('updates input fields correctly', async () => {
    render(<ProposalModal />);
    
    const bidInput = screen.getByLabelText(/Bid Amount/i);
    const daysInput = screen.getByLabelText(/Delivery Time/i);
    
    await userEvent.type(bidInput, '5000');
    await userEvent.type(daysInput, '14');
    
    expect(bidInput).toHaveValue(5000);
    expect(daysInput).toHaveValue(14);
  });

  it('displays error if submitted empty', async () => {
    render(<ProposalModal />);
    
    const submitBtn = screen.getByRole('button', { name: /Submit Proposal/i });
    fireEvent.click(submitBtn);
    
    expect(await screen.findByText('Please fill out all fields.')).toBeInTheDocument();
    expect(mockSubmitProposal).not.toHaveBeenCalled();
  });

  it('calls submit action from store when valid', async () => {
    render(<ProposalModal />);
    
    await userEvent.type(screen.getByLabelText(/Bid Amount/i), '3500');
    await userEvent.type(screen.getByLabelText(/Delivery Time/i), '7');
    await userEvent.type(screen.getByLabelText(/Cover Letter/i), 'This is my cover letter.');
    
    const submitBtn = screen.getByRole('button', { name: /Submit Proposal/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockSubmitProposal).toHaveBeenCalledWith({
        bid_amount: '3500',
        delivery_time: '7',
        cover_letter: 'This is my cover letter.'
      });
    });
  });

  it('updates character count and disables button if exceeding limit', async () => {
    render(<ProposalModal />);
    
    const textArea = screen.getByLabelText(/Cover Letter/i);
    
    // Create string of 1005 characters
    const longString = 'a'.repeat(1005);
    await userEvent.type(textArea, longString, { delay: null }); // disable delay for fast typing
    
    expect(screen.getByText('1005 / 1000')).toBeInTheDocument();
    
    const submitBtn = screen.getByRole('button', { name: /Submit Proposal/i });
    expect(submitBtn).toBeDisabled();
  });
});
