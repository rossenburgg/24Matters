import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import mockAxios from 'jest-mock-axios';

// Mock AsyncStorage and axios
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('axios', () => mockAxios);

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mockAsyncStorage.clear();
  mockAxios.reset();
});

describe('ProfileScreen Integration Tests', () => {
  it('successfully fetches and displays user profile', async () => {
    const fakeResponse = { data: { username: 'TestUser', bio: 'This is a test bio.' } };
    mockAsyncStorage.getItem.mockResolvedValue('fakeToken');
    mockAxios.get.mockResolvedValue(fakeResponse);

    const { getByText } = render(<ProfileScreen />);
    
    await waitFor(() => expect(getByText('TestUser')).toBeTruthy());
    expect(getByText('This is a test bio.')).toBeTruthy();
    console.log('Successfully fetched and displayed user profile');
  });

  it('handles unauthorized access due to invalid or expired token', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('fakeExpiredToken');
    mockAxios.get.mockRejectedValue({ response: { status: 401, data: { message: 'Unauthorized access detected. Please log in again.' } } });

    const { getByText } = render(<ProfileScreen />);
    
    await waitFor(() => expect(getByText('Error')).toBeTruthy());
    expect(getByText('Unauthorized access detected. Please log in again.')).toBeTruthy();
    console.log('Handled unauthorized access due to invalid or expired token');
  });

  // Add more test cases as necessary...
});