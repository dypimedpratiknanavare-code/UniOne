import { useCart, useCurrency, formatPrice, DEFAULT_CURRENCY } from '@/integrations';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Image } from '@/components/ui/image';

export default function Cart() {
  const { items, totalPrice, isOpen, isCheckingOut, actions } = useCart();
  const { currency } = useCurrency();

  return (
    <Sheet open={isOpen} onOpenChange={actions.toggleCart}>
      <SheetContent className="w-full sm:max-w-lg bg-background border-l border-foreground/10">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl text-foreground flex items-center">
            <ShoppingCart className="h-6 w-6 text-primary mr-3" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full mt-8">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <ShoppingCart className="h-16 w-16 text-foreground/30" />
              <p className="font-paragraph text-foreground/60 text-center">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-glassmorphism-overlay backdrop-blur-sm border border-foreground/10 rounded-xl p-4"
                  >
                    <div className="flex gap-4">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading text-lg text-foreground truncate">{item.name}</h4>
                        <p className="font-paragraph text-primary text-lg font-semibold mt-1">
                          {formatPrice(item.price, currency ?? DEFAULT_CURRENCY)}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-primary/50"
                              onClick={() => actions.updateQuantity(item, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-paragraph text-foreground w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-primary/50"
                              onClick={() => actions.updateQuantity(item, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => actions.removeFromCart(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-foreground/10 pt-6 mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-xl text-foreground">Total</span>
                  <span className="font-heading text-2xl text-primary">
                    {formatPrice(totalPrice, currency ?? DEFAULT_CURRENCY)}
                  </span>
                </div>
                
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-paragraph"
                  onClick={actions.checkout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-foreground/20 text-foreground hover:bg-foreground/5"
                  onClick={actions.closeCart}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
