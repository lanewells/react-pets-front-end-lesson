import { useState, useEffect } from "react"
import * as petService from "./services/petService"
import PetList from "./components/PetList"
import PetForm from "./components/PetForm"
import PetDetail from "./components/PetDetail"

const App = () => {
  const [petList, setPetList] = useState([])
  const [selected, setSelected] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const getPets = async () => {
      try {
        const pets = await petService.index()

        if (pets.error) {
          throw new Error(pets.error)
        }

        setPetList(pets)
      } catch (error) {
        console.log(error)
      }
    }
    getPets()
  }, [])

  const handleFormView = (pet) => {
    if (!pet.name) setSelected(null)
    setIsFormOpen(!isFormOpen)
  }

  const updateSelected = (pet) => {
    setSelected(pet)
  }

  const handleAddPet = async (formData) => {
    try {
      const newPet = await petService.create(formData)

      if (newPet.error) {
        throw new Error(newPet.error)
      }

      setPetList([newPet, ...petList])
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdatePet = async (petId, formData) => {
    try {
      console.log("Updating pet with ID:", petId)
      console.log("Form Data:", formData)

      const updatedPet = await petService.updatePet(petId, formData)

      if (updatedPet.error) {
        throw new Error(updatedPet.error)
      }

      console.log("Updated Pet:", updatedPet)

      // Update the pet in the petList state
      setPetList((prevPetList) =>
        prevPetList.map((pet) => (pet._id === petId ? updatedPet : pet))
      )

      // Reset selected and form states
      setSelected(null)
      setIsFormOpen(false)

      // Optional: Notify the user of success
      console.log("Pet updated successfully!")
    } catch (error) {
      console.error("Failed to update pet:", error)
    }
  }

  const handleRemovePet = async (petId) => {
    try {
      const deletedPet = await petService.deletePet(petId)

      if (deletedPet.error) {
        throw new Error(deletedPet.error)
      }

      setPetList((prevPetList) =>
        prevPetList.filter((pet) => pet._id !== petId)
      )
      setSelected(null)
      setIsFormOpen(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <PetList
        petList={petList}
        updateSelected={updateSelected}
        handleFormView={handleFormView}
        isFormOpen={isFormOpen}
      />
      {isFormOpen ? (
        <PetForm
          handleAddPet={handleAddPet}
          handleUpdatePet={handleUpdatePet}
          selected={selected}
        />
      ) : (
        <PetDetail
          selected={selected}
          handleFormView={handleFormView}
          handleRemovePet={handleRemovePet}
        />
      )}
    </>
  )
}

export default App
