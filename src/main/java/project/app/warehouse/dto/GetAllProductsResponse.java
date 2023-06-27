package project.app.warehouse.dto;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Singular;
import lombok.ToString;
import project.app.warehouse.Product;


@ToString
@Setter
@EqualsAndHashCode
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetAllProductsResponse {

    @ToString
    @Setter
    @EqualsAndHashCode
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    private static class _Product{
        private Long product_id;
        private String name;
        //private float quantity;

    };

    @Singular
    private List<_Product> products;


    public static Function<Collection<Product>,GetAllProductsResponse> entityToDtoMapper(){
        return products -> {
            GetAllProductsResponseBuilder response =  GetAllProductsResponse.builder();
            products.stream()
            .map(product -> _Product.builder()
                .product_id(product.getId())
                .name(product.getName())
                //.quantity(product.getQuantity())
                .build())
            .forEach(response::product);
            return response.build();
        };
    }
}
