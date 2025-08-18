import React from 'react'

type DeliveryItem = {
    line_code: string;
    product_description: string;
    quantity: number;
    unit_price: number;
    supplier: string;
    stored: boolean
  }

type DeliveryContextType = {
    items: DeliveryItem[];
    addItem: (item: DeliveryItem) => void;
    clearItems: () => void;
}

const DeliveryContext = React.createContext<DeliveryContextType | null>(null)

export const useDelivery = () => React.useContext(DeliveryContext)!;

export const DeliveryProvider = ({ children}: {
    children: React.ReactNode
}) => {
    const [items, setItems] = React.useState<DeliveryItem[]>([])

    const addItem = (item: DeliveryItem) => {
    setItems((prev) => [...prev, item])
}

    
    const clearItems = () => setItems([])

    return (
        <DeliveryContext.Provider value={{ items, addItem, clearItems}}>
            {children}
        </DeliveryContext.Provider>
    )
}




