import { useState, useEffect } from 'react';
import styles from './ProductGallery.module.css';

interface Product {
  id: number;
  image: string;
  name: string;
  discount?: 'simple' | 'medium' | 'hot';
}

const products: Product[] = [
  {
    id: 1,
    image: 'https://cdn.poehali.dev/files/51e9f46f-7515-4069-9a4f-609e5c3d3f4b.png',
    name: 'BYBIT'
  },
  {
    id: 2,
    image: 'https://cdn.poehali.dev/files/37b1984d-b698-4108-a1ba-628d101ae93e.png',
    name: 'Product 2'
  },
  {
    id: 3,
    image: 'https://cdn.poehali.dev/files/865ad27e-3dce-4b2e-92b7-63aebee30183.png',
    name: 'Product 3'
  },
  {
    id: 4,
    image: 'https://cdn.poehali.dev/files/6a9337b5-b7d7-4642-b210-55676cb99989.png',
    name: 'Product 4'
  },
  {
    id: 5,
    image: 'https://cdn.poehali.dev/files/58b19872-84ad-4492-8737-c175bb0a6944.png',
    name: 'Product 5'
  }
];

export default function ProductGallery() {
  const [imageShapes, setImageShapes] = useState<Record<number, 'square' | 'rect'>>({});

  useEffect(() => {
    products.forEach(product => {
      const img = new Image();
      img.src = product.image;
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const isSquare = aspectRatio >= 0.9 && aspectRatio <= 1.1;
        setImageShapes(prev => ({
          ...prev,
          [product.id]: isSquare ? 'square' : 'rect'
        }));
      };
    });
  }, []);

  return (
    <div className={styles.gallery}>
      {products.map(product => (
        <div key={product.id} className={styles.productContainer}>
          <img
            src={product.image}
            alt={product.name}
            className={imageShapes[product.id] === 'square' ? styles.squareImage : styles.rectImage}
          />
        </div>
      ))}
    </div>
  );
}
