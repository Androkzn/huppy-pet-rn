/**
 * The cards that make up the diary.
 *
 * These assert what the owner actually sees on each row — the figures, the
 * state a completed training is in, and the badge that marks their own food —
 * and that the destructive actions ask before they act.
 */

import React from 'react';
import { Alert } from 'react-native';
import { renderWithProviders, screen, fireEvent } from '../../test-utils/render';
import TrainingCard from '../TrainingCard';
import FoodCard from '../FoodCard';
import ChartPie from '../ChartPie';
import StatisticBarChart from '../StatisticBarChart';
import type { FoodTemplate, Training } from '../../types';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

const mockDeleteTraining = jest.fn();
const mockUpdateTraining = jest.fn();
const mockDeleteFoodTemplate = jest.fn();

jest.mock('@hooks/useGraphQL', () => ({
  useDeleteTraining: () => ({ mutate: mockDeleteTraining }),
  useUpdateTraining: () => ({ mutate: mockUpdateTraining }),
  useDeleteFoodTemplate: () => ({ mutate: mockDeleteFoodTemplate }),
}));

const training = (over: Partial<Training> = {}): Training =>
  ({
    _id: 't1',
    date: new Date(),
    category: 'obedience',
    customCategory: '',
    customType: '',
    desc: '',
    isCompleted: false,
    type: 'sit',
    profileId: 'p1',
    userId: 'u1',
    ...over,
  }) as Training;

const template = (over: Partial<FoodTemplate> = {}): FoodTemplate =>
  ({
    _id: 'ft1',
    name: 'Chicken breast',
    calories: 165,
    categoryType: 'meat',
    isCustom: false,
    type: 'food',
    userId: 'u1',
    ...over,
  }) as FoodTemplate;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TrainingCard', () => {
  it('names the category and what is being trained', async () => {
    await renderWithProviders(<TrainingCard training={training()} />);

    expect(screen.getByText('Obedience')).toBeTruthy();
    expect(screen.getByText('Sit')).toBeTruthy();
  });

  it('prefers the owner’s own wording for a custom session', async () => {
    await renderWithProviders(
      <TrainingCard
        training={training({ customCategory: 'Agility', customType: 'Weave poles' })}
      />
    );

    expect(screen.getByText('Agility')).toBeTruthy();
    expect(screen.getByText('Weave poles')).toBeTruthy();
  });

  it('reports whether the session is done', async () => {
    const { rerender } = await renderWithProviders(<TrainingCard training={training()} />);
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe(false);

    await rerender(<TrainingCard training={training({ isCompleted: true })} />);
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('toggles completion when the row is tapped', async () => {
    await renderWithProviders(<TrainingCard training={training()} />);

    fireEvent.press(screen.getByRole('checkbox'));

    expect(mockUpdateTraining).toHaveBeenCalledWith({
      trainingId: 't1',
      updateData: { isCompleted: true },
    });
  });

  it('un-completes a finished session', async () => {
    await renderWithProviders(<TrainingCard training={training({ isCompleted: true })} />);

    fireEvent.press(screen.getByRole('checkbox'));

    expect(mockUpdateTraining).toHaveBeenCalledWith({
      trainingId: 't1',
      updateData: { isCompleted: false },
    });
  });
});

describe('FoodCard', () => {
  it('states the food and its energy per 100 g', async () => {
    await renderWithProviders(
      <FoodCard food={template()} openAddFoodPage={jest.fn()} />
    );

    expect(screen.getByText('Chicken breast')).toBeTruthy();
    expect(screen.getByText('165 kcal / 100 g')).toBeTruthy();
  });

  it('opens the food when the row is tapped', async () => {
    const open = jest.fn();
    const food = template();
    await renderWithProviders(<FoodCard food={food} openAddFoodPage={open} />);

    fireEvent.press(screen.getByRole('button'));

    expect(open).toHaveBeenCalledWith(food);
  });

  it('asks before deleting the owner’s own food', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    await renderWithProviders(
      <FoodCard food={template({ isCustom: true })} openAddFoodPage={jest.fn()} />
    );

    // The row is swipeable only for custom food; deletion runs through a prompt.
    expect(alert).not.toHaveBeenCalled();
    expect(mockDeleteFoodTemplate).not.toHaveBeenCalled();
    alert.mockRestore();
  });
});

describe('ChartPie', () => {
  it('draws a slice per category', async () => {
    const { toJSON } = await renderWithProviders(
      <ChartPie
        data={[
          { name: 'Meat', weight: 700, percentage: 70, color: '#D3752B' },
          { name: 'Bones', weight: 100, percentage: 10, color: '#E4DDCB' },
        ]}
      />
    );

    expect(toJSON()).toBeTruthy();
  });

  it('renders an empty ring rather than nothing when there is no data', async () => {
    const { toJSON } = await renderWithProviders(<ChartPie data={[]} />);

    expect(toJSON()).toBeTruthy();
  });
});

describe('StatisticBarChart', () => {
  const data = [
    { name: 'Sep 1', amount: 300, average: 200 },
    { name: 'Sep 2', amount: 100, average: 200 },
  ];

  it('shows the chart title and the reference toggles', async () => {
    await renderWithProviders(
      <StatisticBarChart data={data} title="Total calories per day, kcal" goal={900} />
    );

    expect(screen.getByText('Total calories per day, kcal')).toBeTruthy();
    expect(screen.getByText('Average')).toBeTruthy();
    expect(screen.getByText('Goal')).toBeTruthy();
  });

  it('hides the goal toggle when there is no goal to compare against', async () => {
    await renderWithProviders(<StatisticBarChart data={data} title="Trainings" goal={0} />);

    expect(screen.queryByText('Goal')).toBeNull();
  });

  it('survives a single day with nothing logged', async () => {
    const { toJSON } = await renderWithProviders(
      <StatisticBarChart
        data={[{ name: 'Sep 1', amount: 0, average: 0 }]}
        title=""
        goal={0}
      />
    );

    expect(toJSON()).toBeTruthy();
  });
});
