import { useState, useEffect } from 'react';
import { Box, Card, CardMedia, CardContent, Typography, Stack, TextField, Button, Divider } from '@mui/material';
import { useOrder } from '../../contexts/OrderContext';
import { CatalogueService } from '../../services/catalogueService';
import { theme } from '../../theme/colors';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';

interface CatalogueItem {
  id: string;
  name: string;
  salePrice: number;
  mainImage?: string;
  description?: string;
}

export const Step1SelectItems = ({ onNext }: { onNext: () => void }) => {
  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart } = useOrder();
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalogueItems = async () => {
      try {
        const catalogueItems = CatalogueService.getAll();
        const activeItems = catalogueItems.filter(item => item.status !== 'inactive');
        setItems(activeItems as CatalogueItem[]);
      } catch (error) {
        console.error('Failed to load catalogue items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogueItems();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + (item.salePrice * (cart[item.id] || 0)), 0);
  const deliveryCharges = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryCharges;
  const cartItemsCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleQuantityChange = (itemId: string, quantity: string) => {
    const qty = parseInt(quantity, 10) || 0;
    if (qty <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartQuantity(itemId, qty);
    }
  };

  const handleProceed = () => {
    if (cartItemsCount === 0) return;
    onNext();
  };

  if (loading) {
    return <Typography>Loading catalogue items...</Typography>;
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 3 }}>
      {/* Items Grid */}
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: theme.colors.text600 }}>
          Select Items for Order
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {items.map((item) => {
            const quantity = cart[item.id] || 0;

            return (
              <Card key={item.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.mainImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.mainImage}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {item.name}
                  </Typography>

                  {item.description && (
                    <Typography variant="caption" sx={{ color: theme.colors.text300, mb: 2 }}>
                      {item.description}
                    </Typography>
                  )}

                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.primary[600], fontWeight: 700, mb: 2, mt: 'auto' }}
                  >
                    PKR {item.salePrice.toFixed(2)}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: '36px', p: '4px' }}
                      onClick={() => {
                        if (quantity > 1) {
                          updateCartQuantity(item.id, quantity - 1);
                        } else if (quantity === 1) {
                          removeFromCart(item.id);
                        }
                      }}
                    >
                      −
                    </Button>

                    <TextField
                      type="number"
                      size="small"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      inputProps={{ min: 0, style: { textAlign: 'center' } }}
                      sx={{ width: '60px', '& input': { padding: '6px' } }}
                    />

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: '36px', p: '4px' }}
                      onClick={() => addToCart(item.id, 1)}
                    >
                      +
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Box>

      {/* Cart Preview Sidebar */}
      <Box sx={{ position: 'sticky', top: 20, height: 'fit-content' }}>
        <Card sx={{ p: 2, backgroundColor: theme.colors.primary[50] }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: theme.colors.text600 }}>
            Cart Preview
          </Typography>

          <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
            {cartItemsCount === 0 ? (
              <Typography variant="body2" sx={{ color: theme.colors.text300, textAlign: 'center', py: 3 }}>
                No items in cart
              </Typography>
            ) : (
              <Stack spacing={1}>
                {items.map((item) => {
                  const quantity = cart[item.id];
                  if (!quantity) return null;

                  return (
                    <Box key={item.id}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.colors.text300, display: 'block' }}>
                            Qty: {quantity}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          PKR {(item.salePrice * quantity).toFixed(2)}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 0.5 }} />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                PKR {subtotal.toFixed(2)}
              </Typography>
            </Stack>

            {deliveryCharges > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Delivery:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  PKR {deliveryCharges.toFixed(2)}
                </Typography>
              </Stack>
            )}

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Total:
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: theme.colors.primary[600], fontSize: '16px' }}
              >
                PKR {total.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1.5} sx={{ mt: 3 }}>
            <PrimaryButton
              fullWidth
              onClick={handleProceed}
              disabled={cartItemsCount === 0}
              sx={{ textTransform: 'none', fontSize: '14px' }}
            >
              Proceed to Customer Details
            </PrimaryButton>

            {cartItemsCount > 0 && (
              <SecondaryButton fullWidth onClick={clearCart} sx={{ textTransform: 'none', fontSize: '14px' }}>
                Clear Cart
              </SecondaryButton>
            )}
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};
