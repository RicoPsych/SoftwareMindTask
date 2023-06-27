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
public class PutProductRequest {
    private String name;
    private float quantity;

    public static Function<PutProductRequest, Product> dtoToEntityMapper(long product_id){
        return request -> Product.builder()
            .id(product_id)
            .name(request.getName())
            .quantity(request.getQuantity())
            .build();
    }
}
