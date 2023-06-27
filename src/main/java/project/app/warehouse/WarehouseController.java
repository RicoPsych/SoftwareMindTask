package project.app.warehouse;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import project.app.warehouse.dto.GetAllProductsResponse;
import project.app.warehouse.dto.GetProductResponse;
import project.app.warehouse.dto.PostProductRequest;
import project.app.warehouse.dto.PutProductRequest;

@RestController
@RequestMapping("api/products")
@CrossOrigin
public class WarehouseController {
    private WarehouseService service;

    public int requestsAmount;


    @Autowired
    WarehouseController(WarehouseService service){
        this.service = service;
        
        requestsAmount = 0; //Tu lub dodac do bazy
    }

    @GetMapping("{id}")
    public ResponseEntity <GetProductResponse> getProduct(@PathVariable("id") long product_id){
        requestsAmount++;
        Optional<Product> product = service.find(product_id);
        if(product.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(GetProductResponse.entityToDtoMapper().apply(product.get()));
    }
    @GetMapping("")
    public ResponseEntity <GetAllProductsResponse> getProducts(){
        requestsAmount++;
        List<Product> products = service.findAll();

        return ResponseEntity.ok(GetAllProductsResponse.entityToDtoMapper().apply(products));
    }

    @GetMapping("rq_amount")
    public ResponseEntity <Integer> getRequestsAmount(){
        //requestsAmount++;
    
        return ResponseEntity.ok(requestsAmount);
    }

    @RequestMapping("")
    public ResponseEntity<Void> createProduct( @RequestBody PostProductRequest rq){
        requestsAmount++;
        Product product = PostProductRequest.dtoToEntityMapper().apply(rq);
        service.save(product);

        return ResponseEntity.ok().build();
    }

    @PutMapping("{id}")
    public ResponseEntity<Void> updateProduct(@PathVariable("id") long product_id, @RequestBody PutProductRequest rq){
        requestsAmount++;
        Optional<Product> existing_product = service.find(product_id);
        if(existing_product.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        
        Product product = PutProductRequest.dtoToEntityMapper(product_id).apply(rq);
        service.update(product);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") long product_id){
        requestsAmount++;
        Optional<Product> product = service.find(product_id);
        if(product.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        
        service.delete(product.get());
        return ResponseEntity.ok().build();
    }
}
