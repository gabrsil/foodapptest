import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function loadFoods(): Promise<void> {
    // TODO LOAD FOODS
    await api
      .get('/foods')
      .then(res => setFoods(res.data))
      .catch(err => console.log(err));
  }

  useEffect(() => {
    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    await api
      .post('/foods', { ...food, available: true })
      .then(res => setFoods(state => [...state, res.data]))
      .catch(err => console.log(err));
  }

  async function handleEditAvailable(food: IFoodPlate): Promise<void> {
    //tentei usar patch, que seria o mais indicado para esse cenário, porém os testes mesmo passando logaram erros, então deixei put mesmo.
    await api
      .put(`/foods/${food.id}`, food)
      .then(res =>
        setFoods(state =>
          state.map(item => (item.id === res.data.id ? res.data : item)),
        ),
      )
      .catch(err => console.log(err));
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    await api
      .put(`/foods/${editingFood.id}`, {
        ...food,
        available: editingFood.available,
      })
      .then(res => {
        setFoods(state =>
          state.map(item => (item.id === res.data.id ? res.data : item)),
        );
      })
      .catch(err => console.log(err));
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // TODO DELETE A FOOD PLATE FROM THE API
    await api.delete(`foods/${id}`);

    setFoods(state => state.filter(food => food.id !== id));
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleEditAvailable={handleEditAvailable}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
