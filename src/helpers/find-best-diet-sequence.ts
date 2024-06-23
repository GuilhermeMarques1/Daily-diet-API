import { Meals } from '../types/Meals'

function compareDateAndTime(meal: Meals, pivot: Meals): boolean {
  const combinedStringDateMeal = meal.date + 'T' + meal.time
  const combinedStringDatePivot = pivot.date + 'T' + pivot.time

  const dateMeal = new Date(combinedStringDateMeal)
  const datePivot = new Date(combinedStringDatePivot)

  return dateMeal < datePivot
}

function partition(meals: Meals[], low: number, high: number): number {
  const pivot = meals[high]
  let i = low - 1

  for (let j = low; j <= high - 1; j++) {
    if (compareDateAndTime(meals[j], pivot)) {
      i++
      ;[meals[i], meals[j]] = [meals[j], meals[i]]
    }
  }

  ;[meals[i + 1], meals[high]] = [meals[high], meals[i + 1]]
  return i + 1
}

function quickSortToOrderMeals(
  meals: Meals[],
  low: number,
  high: number,
): Meals[] {
  if (low >= high) return meals
  const pivot = partition(meals, low, high)

  quickSortToOrderMeals(meals, low, pivot - 1)
  quickSortToOrderMeals(meals, pivot + 1, high)

  return meals
}

export function findBestDietSequence(meals: Meals[]): number {
  const orderedMeals = quickSortToOrderMeals(meals, 0, meals.length - 1)

  let actualSequence = 0
  let bestSequence = 0

  orderedMeals.forEach((meal) => {
    if (meal.diet) {
      actualSequence++

      if (bestSequence < actualSequence) bestSequence = actualSequence
    } else {
      actualSequence = 0
    }
  })

  return bestSequence
}
