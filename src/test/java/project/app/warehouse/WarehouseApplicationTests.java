package project.app.warehouse;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class WarehouseApplicationTests {

	@Mock
	private WarehouseRepository repository;
	@InjectMocks
	private WarehouseService service;

	// @Test
	// void contextLoads() {
	// }


	@Test
	void saving_in_service(){

		//Arrange
		Product product = Product.builder().id(1l).name("test").quantity(2.0f).build();
		when(repository.save(any(Product.class)) ).thenReturn(product); 
		//Act	
		Product actual = service.save(product);
		//Assert
		Product expected = Product.builder().id(1l).name("test").quantity(2.0f).build();
		assertTrue(actual.equals(expected));
	}

	@Test
	void updating_in_service(){

		//Arrange
		Product productToBeUpdated = Product.builder().id(1l).name("test").quantity(2.0f).build();
		Product updatedProduct = Product.builder().id(1l).name("test2").quantity(3.0f).build();
		when(repository.findById(any(Long.class)) ).thenReturn(Optional.of(productToBeUpdated)); 

		//Act	
		Optional<Product> actual = service.update(updatedProduct);
		//Assert
		Optional<Product> expected = Optional.of(Product.builder().id(1l).name("test2").quantity(3.0f).build());
		assertTrue(actual.equals(expected));
	}

	@Test
	void updating_in_service_enitity_does_not_exist(){

		//Arrange
		Product updatedProduct = Product.builder().id(1l).name("test2").quantity(3.0f).build();
		when(repository.findById(any(Long.class)) ).thenReturn(Optional.empty()); 

		//Act	
		Optional<Product> actual = service.update(updatedProduct);
		//Assert
		Optional<Product> expected = Optional.empty();
		assertTrue(actual.equals(expected));
	}
}
