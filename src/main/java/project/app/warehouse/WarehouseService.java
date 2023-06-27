package project.app.warehouse;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;


@Service
public class WarehouseService {
    private WarehouseRepository repository;

    @Autowired
    WarehouseService(WarehouseRepository repository){
        this.repository = repository;

    }

    public Optional<Product> find(Long product_id){
        return repository.findById(product_id);
    }

    public List<Product> findAll(){
        return repository.findAll();
    }
    
    public List<Product> findByNameContains(String query){
        return repository.findByNameContains(query);
    }

    @Transactional
    public Product save(Product product){
        return repository.save(product);
    }

    @Transactional
    public void delete(Product product){
        repository.delete(product);
    }

    @Transactional
    public Optional<Product> update(Product product){
        Optional<Product> opt = repository.findById(product.getId());
            opt.ifPresent(
                raport -> {
                    raport.setName(product.getName());
                    raport.setQuantity(product.getQuantity());
                    
                    repository.save(raport);
                });
        return opt;
    }

}