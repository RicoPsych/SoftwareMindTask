package project.app.warehouse.dto;

import java.util.function.Function;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import project.app.warehouse.Product;


@ToString
@Setter
@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class GetProductResponse {
    private Long product_id;
    private String name;
    private float quantity;

    public static Function<Product,GetProductResponse> entityToDtoMapper(){
        return product -> GetProductResponse.builder()
            .product_id(product.getId())
            .name(product.getName())
            .quantity(product.getQuantity())
            .build();
    }
    
}
